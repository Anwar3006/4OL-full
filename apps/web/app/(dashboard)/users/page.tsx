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
import { useViewUserDialog } from "@/stores/dialog-store";

export default function UsersPage() {
  const viewDialog = useViewUserDialog();

  // 1. Separate State for Admins
  const [adminPage, setAdminPage] = useState(1);
  const [adminSearch, setAdminSearch] = useState("");

  // 2. Separate State for Users
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const limit = 10;

  // ✅ Fetch data in the page component
  const {
    data: adminData,
    isLoading: adminLoading,
    error: adminError,
    isFetching: adminIsFetching,
  } = trpc.userProfiles.allUsers.useQuery({
    page: adminPage,
    limit,
    search: adminSearch,
    admin: true,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    isFetching: usersIsFetching,
  } = trpc.userProfiles.allUsers.useQuery(
    {
      page: userPage,
      limit,
      search: userSearch,
    },
    { enabled: showUsers }
  );

  // Handle pagination
  const adminPagination = createPaginationHandlers(
    adminPage,
    setAdminPage,
    adminData?.totalPages
  );

  const userPagination = createPaginationHandlers(
    userPage,
    setUserPage,
    usersData?.totalPages
  );

  if (showUsers && usersIsFetching) return <TableSkeleton />;

  if (adminError) {
    return (
      <ErrorState error={adminError.message} onRetry={() => setAdminPage(1)} />
    );
  }
  if (usersError) {
    return (
      <ErrorState error={usersError.message} onRetry={() => setUserPage(1)} />
    );
  }

  return (
    <div className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      {/* SECTION 1: ADMINS */}
      <section>
        <SectionHeader
          title="Admins"
          description="Manage your admin users and their roles"
          Icon={MailPlus}
          hasButton
          buttonLabel="Invite Admin"
        />

        {adminLoading ? (
          <TableSkeleton />
        ) : (
          <>
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  className="pl-9 w-full"
                  value={adminSearch}
                  onChange={(e) => {
                    setAdminSearch(e.target.value);
                    setAdminPage(1); // Reset to page 1 on search
                  }}
                />
              </div>

              {/* Filters */}
              <Button
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard label="Total Admins" value={adminData?.total || 0} />
              <StatsCard
                label="Active"
                value={adminData?.stats?.active || 0}
                variant="success"
              />
              <StatsCard
                label="Pending"
                value={adminData?.stats?.pending || 0}
                variant="warning"
              />
              <StatsCard
                label="Inactive"
                value={adminData?.stats?.inactive || 0}
                variant="neutral"
              />
            </div>

            {/* ✅ DataTable with dialog support */}
            <DataTable
              columns={userColumns}
              data={adminData?.users || []}
              cardConfig={userCardConfig}
              onRowClick={(user) => viewDialog.open(user.userId)}
              pagination={{
                currentPage: adminPage,
                totalPages: adminData?.totalPages || 1,
                totalItems: adminData?.total || 0,
                pageSize: limit,
                onPageChange: adminPagination.goTo,
                onNextPage: adminPagination.next,
                onPreviousPage: adminPagination.previous,
                canNextPage: adminPage < (adminData?.totalPages || 1),
                canPreviousPage: adminPage > 1,
              }}
              isLoading={adminIsFetching}
            />
          </>
        )}
      </section>

      <Separator className="my-4 md:my-6 lg:my-8" />

      <section className="my-5 md:my-8 lg:my-10">
        {/* TOGGLE BUTTON */}
        {!showUsers && (
          <Button
            onClick={() => setShowUsers(true)}
            className="w-full md:w-auto"
          >
            <Users size={16} />
            Load Standard Users
          </Button>
        )}

        {/* SECTION 2: USERS (Conditional Rendering) */}
        {showUsers && (
          <>
            {/* Users */}
            <SectionHeader
              title="Users"
              description="Manage your mobile app users"
              Icon={Users}
              hasButton={false}
            />
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  className="pl-9 w-full"
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUserPage(1); // Reset to page 1 on search
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                label="Total App Users"
                value={usersData?.total || 0}
              />
              <StatsCard
                label="Active"
                value={usersData?.stats?.active || 0}
                variant="success"
              />
              <StatsCard
                label="Pending"
                value={usersData?.stats?.pending || 0}
                variant="warning"
              />
              <StatsCard
                label="Inactive"
                value={usersData?.stats?.inactive || 0}
                variant="neutral"
              />
            </div>

            {/* ✅ DataTable with dialog support */}
            <DataTable
              columns={userColumns}
              data={usersData?.users as []}
              cardConfig={userCardConfig}
              onRowClick={(user) => viewDialog.open(user.userId)}
              pagination={{
                currentPage: userPage,
                totalPages: usersData?.totalPages || 1,
                totalItems: usersData?.total || 0,
                pageSize: limit,
                onPageChange: userPagination.goTo,
                onNextPage: userPagination.next,
                onPreviousPage: userPagination.previous,
                canNextPage: userPage < (usersData?.totalPages || 1),
                canPreviousPage: userPage > 1,
              }}
              isLoading={usersIsFetching}
            />
          </>
        )}
      </section>
    </div>
  );
}
