"use client";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";

import { Button } from "@/components/ui/button";
import { MailPlus, Search, Filter, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  EmptyState,
  ErrorState,
  StatsCard,
  TableSkeleton,
} from "@/components/Data-Table/helpers";
import { userColumns } from "@/components/Data-Table/columns/userColumns";

import { DataTable } from "@/components/Data-Table/data-table";
import SectionHeader from "@/components/SectionHeader";
import { Separator } from "@/components/ui/separator";
import { createPaginationHandlers } from "@/lib/utils";

import { userCardConfig } from "@/components/Data-Table/mobile-table-configs/userCardConfig";
import { useAddAdminDialog, useViewUserDialog } from "@/stores/dialog-store";
import { UserViewDialog } from "@/components/dialogs/UserViewDialog";
import AddAdminDialog from "./_components/add-admin-dialog";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";
import AdminSection from "./_components/AdminSection";
import UserSection from "./_components/UserSection";

export default function UsersPage() {
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      {/* SECTION 1: ADMINS */}
      <AdminSection />

      <Separator className="my-4 md:my-6 lg:my-8" />

      <section className="my-5 md:my-8 lg:my-10">
        {/* TOGGLE BUTTON */}
        {!showUsers ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
            <Users className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Standard User Records</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Load the mobile application user database.
            </p>
            <Button onClick={() => setShowUsers(true)} size="lg">
              Load Standard Users
            </Button>
          </div>
        ) : (
          // SECTION 2: USERS
          <UserSection />
        )}
      </section>

      {/* Dialogs */}
      <UserViewDialog />
      <AddAdminDialog />
    </div>
  );
}
