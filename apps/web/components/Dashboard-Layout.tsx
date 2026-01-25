"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import DashboardHeader from "@/components/DashboardHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import DashboardLoading from "@/app/(dashboard)/loading";
import { useUser } from "@/hooks/supabase-calls/useUser";

export const DashboardLayoutClient = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) => {
  const router = useRouter();
  const { data, isLoading } = useUser({
    id: user.id,
    enabled: !!user.id,
  });

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (data?.role === "user") {
    router.push("/login");
    return null;
  }
  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DashboardHeader />
        </header>

        <div className="flex-1 overflow-auto p-4 min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
