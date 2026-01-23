// ===================================================================
// UPDATED FILE: apps/web/actions/authenticate.actions.ts
// MIGRATION: Resend → Twilio SendGrid
// ===================================================================

"use server";
import { supabase } from "@/lib/supabase";
import {
  TAdminInviteSchema,
  TUserProfile,
} from "@4ol/db/schemas/user-profile.schema";
import { InviteAdminEmail } from "@4ol/email-sender/emails/admins/invite-admin";
import { render } from "@react-email/render"; // NEW: For converting React Email to HTML

import { auth } from "@4ol/api/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

// ===================================================================
// CHANGE 1: Replace Resend with SendGrid
// ===================================================================
// OLD: import { Resend } from "resend";
// OLD: const resend = new Resend(process.env.RESEND_API_KEY);

import sgMail from "@sendgrid/mail"; // NEW: SendGrid SDK

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// ===================================================================
// NO CHANGES NEEDED - Keep existing function as-is
// ===================================================================
const createAdminInvite = async (input: TAdminInviteSchema) => {
  try {
    const { data, error } = await supabase
      .from("user_invites")
      .select("id")
      .eq("email", input.email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) throw new Error("Invite already sent");

    const { data: result, error: error2 } = await supabase
      .from("user_invites")
      .insert({
        email: input.email,
        role: input.role,
        token: input.token,
        expires_at: input.expires_at,
      })
      .select()
      .single();

    if (error2) throw error2;
    return result;
  } catch (error) {
    throw error;
  }
};

// ===================================================================
// CHANGE 2: Update email sending logic
// ===================================================================
export async function inviteAdminAction(email: string, role: string) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: {
        cookie: requestHeaders.get("cookie") as string,
      },
    });

    if (session?.user?.role !== "admin") {
      throw new Error(
        "Unauthorized: You do not have permission to invite admins."
      );
    }

    const token = nanoid(24);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await createAdminInvite({
      email,
      role: role as TUserProfile["role"],
      token,
      expires_at: expiresAt,
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;

    // ================================================================
    // NEW: Convert React Email component to HTML
    // ================================================================
    const emailHtml = render(
      InviteAdminEmail({ 
        email, 
        inviteLink 
      })
    );

    // ================================================================
    // NEW: Send email using SendGrid
    // ================================================================
    const isProd = process.env.NODE_ENV === "production";
    
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "admin@4ourlife.com",
        name: process.env.SENDGRID_FROM_NAME || "4 Our Life",
      },
      subject: "Invitation to join 4 Our Life",
      html: emailHtml,
    };

    const result = await sgMail.send(msg);

    // ================================================================
    // NEW: Format response to match previous Resend format
    // ================================================================
    // SendGrid returns [response, body] array
    return {
      data: {
        id: result[0].headers["x-message-id"] || null,
      },
      error: null,
    };

    // ================================================================
    // OLD CODE (Resend) - REMOVED
    // ================================================================
    // const isProd = process.env.NODE_ENV === "production";
    // const result = await resend.emails.send({
    //   from: isProd
    //     ? "4 Our Life <admin@4ourlife.com>"
    //     : "onboarding@resend.dev",
    //   to: [email],
    //   subject: "Invitation to join 4 Our Life",
    //   react: InviteAdminEmail({ email, inviteLink }),
    // });
    // return result;
    // ================================================================

  } catch (error: any) {
    console.error("Error sending invitation:", error);
    
    // ================================================================
    // NEW: Enhanced error handling for SendGrid
    // ================================================================
    if (error.response) {
      console.error("SendGrid Error Details:", {
        statusCode: error.code,
        body: error.response.body,
        headers: error.response.headers,
      });
    }
    
    // Return error in consistent format
    return {
      data: null,
      error: error.message || "Failed to send invitation email",
    };
  }
}

// ===================================================================
// SUMMARY OF CHANGES:
// ===================================================================
// 1. ✅ Replaced Resend import with SendGrid
// 2. ✅ Added @react-email/render import
// 3. ✅ Initialized SendGrid with API key
// 4. ✅ Converted React Email to HTML using render()
// 5. ✅ Updated send logic to use SendGrid API
// 6. ✅ Enhanced error handling for SendGrid errors
// 7. ✅ Maintained backward-compatible response format
// 8. ✅ No changes to createAdminInvite function
// 9. ✅ No changes to UI components needed
// ===================================================================

// ===================================================================
// ENVIRONMENT VARIABLES NEEDED:
// ===================================================================
// Add these to .env.local:
// SENDGRID_API_KEY=your_sendgrid_api_key_here
// SENDGRID_FROM_EMAIL=admin@4ourlife.com
// SENDGRID_FROM_NAME=4 Our Life
// ===================================================================

// ===================================================================
// PACKAGE INSTALLATION:
// ===================================================================
// Run: npm install @sendgrid/mail --workspace=apps/web
// ===================================================================
