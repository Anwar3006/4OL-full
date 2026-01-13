"use client";

import { useMemo } from "react";
import { SIDEBAR_NAV_ITEMS } from "@/constants/sidebar.const";
import { canAccessRoute, hasPermission } from "@/lib/utils";
import { usePermissions } from "@/stores/permission-context";

export const useAdminPermissions = () => {
  const { role, permissions } = usePermissions();

  const filteredNavItems = useMemo(
    () => SIDEBAR_NAV_ITEMS.filter((item) => canAccessRoute(role, item.url)),
    [role]
  );

  const canDo = (action: string) => hasPermission(permissions.actions, action);

  return { filteredNavItems, canDo, role };
};
