"use server";
import { serverApi } from "@/lib/trpc-serverCaller";
import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";
import { InviteAdminEmail } from "@4ol/email-sender/emails/admins/invite-admin";

import { nanoid } from "nanoid";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function inviteAdminAction(email: string, role: string) {
  try {
    const token = nanoid(24);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const trpcServerSide = await serverApi();
    await trpcServerSide.userProfiles.insertAdminInvite({
      email,
      role: role as TUserProfile["role"],
      token,
      expiresAt,
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
    console.log("After to send emails");

    return result;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}
