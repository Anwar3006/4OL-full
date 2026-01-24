"use client";
import React from "react";
import { ViewUserDialog } from "@/app/(dashboard)/users/_components/view-user-dialog";
import AddAdminDialog from "../admins/_components/add-admin-dialog";

import UserSection from "./_components/UserSection";

export default function UsersPage() {
  return (
    <div className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <UserSection />

      {/* Dialogs */}
      <ViewUserDialog />
      <AddAdminDialog />
    </div>
  );
}
