"use server";

import { serverApi } from "@/lib/trpc-serverCaller";
import { PermissionProviderClient } from "@/stores/permission-context";
import { auth } from "@4ol/api/src/auth";
import { headers } from "next/headers";
import { permanentRedirect, redirect } from "next/navigation";
import { ReactNode } from "react";

export const PermissionsProvider = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const betterAuthUserSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!betterAuthUserSession || !betterAuthUserSession.user) {
    return <>{children}</>;
  }

  let userInfo;
  try {
    // 1. Initialize the caller with context
    const api = await serverApi();

    // 2. Fetch data directly (no useQuery needed on server)
    userInfo = await api.userProfiles.getById({
      id: betterAuthUserSession?.user.id!,
    });
  } catch (error) {
    console.error("Auth server-side error:", error);
    return <>{children}</>;
  }

  // if (
  //   userInfo.status === "suspended" ||
  //   userInfo.status === "pending" ||
  //   userInfo.role === "user"
  // ) {
  //   permanentRedirect("/not-found");
  // }

  // 3. Pass the role to the Client Provider
  return (
    <PermissionProviderClient userRole={userInfo.role}>
      {children}
    </PermissionProviderClient>
  );
};
