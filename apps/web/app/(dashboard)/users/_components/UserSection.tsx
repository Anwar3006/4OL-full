"use client";
import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Filter, MailPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Data-Table/data-table";
import {
  ErrorState,
  StatsCard,
  TableSkeleton,
} from "@/components/Data-Table/helpers";
import SectionHeader from "@/components/SectionHeader";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";
import { useAddAdminDialog, useViewUserDialog } from "@/stores/dialog-store";

import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";
import { userColumns } from "@/components/Data-Table/columns/userColumns";
import { createPaginationHandlers } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

export default function UserSection() {
  const addAdminDialog = useAddAdminDialog();
  const viewDialog = useViewUserDialog();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const limit = 10;

  const { data, isLoading, isFetching, error } =
    trpc.userProfiles.allUsers.useQuery({
      page,
      limit,
      search: debouncedSearch,
    });

  const userPagination = createPaginationHandlers(
    page,
    setPage,
    data?.totalPages
  );

  if (isLoading) return <TableSkeleton />;

  if (error) {
    return <ErrorState error={error.message} onRetry={() => setPage(1)} />;
  }
  // ⚡ Bolt: Memoize props passed to DataTable to prevent re-renders.
  // `useCallback` stabilizes the onRowClick function, `useMemo` stabilizes the pagination object.
  const handleRowClick = useCallback(
    (user: TUserProfile) => viewDialog.open(user.userId),
    [viewDialog]
  );

  const paginationProps = useMemo(
    () => ({
      currentPage: page,
      totalPages: data?.totalPages || 1,
      totalItems: data?.total || 0,
      pageSize: limit,
      onPageChange: userPagination.goTo,
      onNextPage: userPagination.next,
      onPreviousPage: userPagination.previous,
      canNextPage: page < (data?.totalPages || 1),
      canPreviousPage: page > 1,
    }),
    [page, data?.totalPages, data?.total, userPagination]
  );

  return (
    <section>
      <SectionHeader
        title="Users"
        description="Manage your mobile app users"
        Icon={Users}
        hasButton={false}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total App Users" value={data?.total || 0} />
        <StatsCard
          label="Active"
          value={data?.stats?.active || 0}
          variant="success"
        />
        <StatsCard
          label="Pending"
          value={data?.stats?.pending || 0}
          variant="warning"
        />
        <StatsCard
          label="Inactive"
          value={data?.stats?.inactive || 0}
          variant="neutral"
        />
      </div>

      <DataTable
        columns={userColumns}
        data={data?.users || []}
        isLoading={isFetching}
        onRowClick={handleRowClick}
        pagination={paginationProps}
      />
    </section>
  );
}
