import React from "react";

import { auth } from "@4ol/api/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardLayoutClient } from "@/components/Dashboard-Layout";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // 1. Pass headers to BetterAuth so it can read the cookies
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Gatekeeping: Server-side redirect is instant
  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient user={session?.user}>
      <div className="flex-1 overflow-auto md:p-4">{children}</div>
    </DashboardLayoutClient>
  );
};

export default DashboardLayout;
