"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./NavUser";
import { TBetterAuthUser } from "@4ol/db/schemas/user-profile.schema";
import { Button } from "./ui/button";
import { SIDEBAR_NAV_ITEMS } from "@/constants/sidebar.const";
import Image from "next/image";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

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
      <SidebarContent className="px-2 flex-1">
        <SidebarGroup>
          {/* 1. Added the missing SidebarMenu wrapper */}
          <SidebarMenu className="flex flex-col min-h-full">
            {navItems.map((item) => {
              const hasChildren = item.items && item.items.length > 0;
              const isActive =
                pathname === item.url ||
                item.items?.some((child) => pathname === child.url);

              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={isActive ? "bg-green-200!" : ""}
                        >
                          <item.icon size={16} />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                                onClick={() => isMobile && setOpenMobile(false)}
                              >
                                <Link href={subItem.url}>
                                  <subItem.icon size={14} />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={isActive ? "bg-green-200! font-bold!" : ""}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <Link href={item.url}>
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto pb-5">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
