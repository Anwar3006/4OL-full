"use server";
import { supabase } from "@/lib/supabase";
import {
  TAdminInviteSchema,
  TUserProfile,
} from "@4ol/db/schemas/user-profile.schema";
import { InviteAdminEmail } from "@4ol/email-sender/emails/admins/invite-admin";

import { auth } from "@4ol/api/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const isProd = process.env.NODE_ENV === "production";
    const result = await resend.emails.send({
      from: isProd
        ? "4 Our Life <admin@4ourlife.com>"
        : "onboarding@resend.dev",
      to: [email],
      subject: "Invitation to join 4 Our Life",
      react: InviteAdminEmail({ email, inviteLink }),
    });

    return result;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}
