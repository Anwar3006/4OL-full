"use server";

import { supabase } from "@/lib/supabase";
import { PermissionProviderClient } from "@/stores/permission-context";
import { auth } from "@4ol/api/src/auth";
import { headers } from "next/headers";
import { ReactNode } from "react";

export const PermissionsProvider = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const betterAuthUserSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!betterAuthUserSession?.user) {
    return <>{children}</>;
  }

  let userInfo;
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("role, status")
      .eq("user_id", betterAuthUserSession.user.id)
      .single();

    if (error) throw error;

    userInfo = data;
  } catch (error) {
    console.error("Auth server-side error:", error);
    return <>{children}</>;
  }

  // 3. Pass the role to the Client Provider
  return (
    <PermissionProviderClient userRole={userInfo?.role}>
      {children}
    </PermissionProviderClient>
  );
};
