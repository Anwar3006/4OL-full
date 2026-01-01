"use client";

import { SIDEBAR_NAV_ITEMS } from "@/constants/sidebar.const";
import { canAccessRoute, hasPermission } from "@/lib/utils";

import { usePermissions } from "@/stores/permission-context";

export const useAdminPermissions = () => {
  const { role, permissions } = usePermissions();

  const filteredNavItems = SIDEBAR_NAV_ITEMS.filter((item) =>
    canAccessRoute(role, item.url)
  );

  const canDo = (action: string) => hasPermission(permissions.actions, action);

  return { filteredNavItems, canDo, role };
};
