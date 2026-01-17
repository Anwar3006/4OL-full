"use client";
import React from "react";

import AdminSection from "./_components/AdminSection";
import AddAdminDialog from "./_components/add-admin-dialog";
import { ViewUserDialog } from "@/components/dialogs/ViewUserDialog";

export default function UsersPage() {
  return (
    <div className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      {/* SECTION 1: ADMINS */}
      <AdminSection />

      {/* Dialogs */}
      <ViewUserDialog />
      <AddAdminDialog />
    </div>
  );
}
