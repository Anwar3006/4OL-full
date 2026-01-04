"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./NavUser";
import { TBetterAuthUser } from "@4ol/db/schemas/user-profile.schema";
import { Button } from "./ui/button";
import { SIDEBAR_NAV_ITEMS } from "@/constants/sidebar.const";
import Image from "next/image";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: TBetterAuthUser;
}) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const { filteredNavItems, canDo, role } = useAdminPermissions();

  const navItems =
    role === "super_admin" ? SIDEBAR_NAV_ITEMS : filteredNavItems;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="mb-6 flex flex-row items-center justify-between">
        {/* put app logo */}
        <div className="flex items-end gap-6 px-2">
          <Image
            src={"/assets/images/all-img/logo.png"}
            alt="Logo"
            priority={true}
            width={50}
            height={50}
          />

          <h1 className="font-bold text-xl text-green-600/80">4 Our Life</h1>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close sidebar"
          onClick={() => setOpenMobile(false)}
          className="md:hidden"
        >
          <X size={16} />
        </Button>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {/* We create a SidebarGroup for each parent. */}
        {navItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={`${isActive ? "bg-green-200! font-bold!" : ""}`}
                onClick={() => isMobile && setOpenMobile(false)}
              >
                <Link href={item.url} className="flex items-center gap-2">
                  <item.icon size={16} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="my-5">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
