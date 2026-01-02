// packages/email-sender/index.ts
// import { Resend } from 'resend';
import { InviteAdminEmail } from "@/emails/admins/invite-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAdminInvite = async (email: string, inviteLink: string) => {
  return await resend.emails.send({
    from: "Health Panel <no-reply@yourdomain.com>",
    to: email,
    subject: "Join the Health Admin Panel",
    react: InviteAdminEmail({ email, inviteLink }),
  });
};
