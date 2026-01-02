import { trpc } from "@/lib/trpc";
import RegisterForm from "../_components/RegisterForm";
import DashboardLoading from "@/app/(dashboard)/loading";
import { redirect } from "next/navigation";
import { serverApi } from "@/lib/trpc-serverCaller";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  // 1. Verify token in DB
  const { token } = await searchParams;
  if (!token) {
    return redirect("/register");
  }

  const api = serverApi();
  const invite = await (await api).userProfiles.getInvitedAdmin({ token });

  const expiresAt = invite?.expiresAt
    ? typeof invite.expiresAt === "string"
      ? new Date(invite.expiresAt)
      : invite.expiresAt
    : null;

  if (!invite || (expiresAt && expiresAt < new Date())) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4 text-center">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-sm border border-emerald-100">
          <h1 className="text-xl font-semibold text-gray-900">
            Expired Invitation
          </h1>
          <p className="mt-2 text-gray-600">
            This invitation is invalid, has already been used, or has expired.
          </p>
        </div>
      </div>
    );
  }

  // 2. Pass the email and role to the Client Form
  // These will be rendered as disabled inputs
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 h-[98vh] overflow-y-scroll">
        <div className="flex justify-center gap-2 md:justify-start items-end">
          <a href="/register" className="flex items-center gap-2 ">
            <div className="p-2 text-primary-foreground flex size-full items-center justify-center rounded-xl shadow-sm border border-muted">
              <img
                src="/assets/images/all-img/logo.png"
                alt="Logo"
                className="w-10 rounded-md "
              />
            </div>
          </a>
          <span className="text-sm font-medium underline underline-offset-3">
            4 Our Life.
          </span>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm
              isInvited={true}
              inviteData={{ email: invite.email, role: invite.role }}
            />
          </div>
        </div>
      </div>

      <div className="bg-green-200 relative hidden lg:block h-full">
        <img
          src="/placeholder.svg"
          alt="placeholder"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
