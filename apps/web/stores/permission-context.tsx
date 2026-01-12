"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";
import { getPermissionsForRole } from "@/lib/utils";

interface PermissionContextType {
  role: TUserProfile["role"];
  permissions: {
    allowedRoutes: string[];
    actions: string[];
  };
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export const PermissionProviderClient = ({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole: TUserProfile["role"];
}) => {
  // Logic is centralized here
  const permissions = getPermissionsForRole(userRole);

  const value = useMemo(
    () => ({ role: userRole, permissions }),
    [userRole, permissions]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom Hook for easier access
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};
