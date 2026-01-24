"use client";
import SectionHeader from "@/components/SectionHeader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import AddFacilityDialog from "../_components/add-facility-dialog";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { StatsCard } from "@/components/Data-Table/helpers";
import { DataTable } from "@/components/Data-Table/data-table";
import { createPaginationHandlers } from "@/lib/utils";
import { facilityColumns } from "@/components/Data-Table/columns/facilityColumns";
import { facilityCardConfig } from "@/components/Data-Table/mobile-table-configs/facilityCardConfig";

import {
  useAddFacilityDialog,
  useViewFacilityDialog,
} from "@/stores/dialog-store";
import { useFacilityProfiles } from "@/hooks/supabase-calls/useFacilities";
import { FacilityViewDialog } from "../_components/view-facility-dialog";

const FacilityPage = () => {
  const params = useParams();
  const type = decodeURIComponent(params.type as string);
  const addFacilityDialog = useAddFacilityDialog();
  const viewFacilityDialog = useViewFacilityDialog();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const currentStatus = searchParams.get("status");

  const { data, isLoading } = useFacilityProfiles({
    limit: limit,
    page: page,
    type: type,
    includeStatsOnly: false,
    status: currentStatus || undefined,
  });

  const handleStatusChange = (status: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status"); // For "Total Registered" to show all
    }
    router.push(`?${params.toString()}`);
  };

  const facilitiesPagination = useMemo(
    () => createPaginationHandlers(page, setPage, data?.analytics?.totalPages),
    [page, data?.analytics?.totalPages],
  );

  const sectionTitle = type
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // ⚡ Bolt Optimization: Memoize props for the `DataTable` component.
  // `useCallback` and `useMemo` prevent these props from being recreated on every render,
  // which would otherwise cause the memoized `DataTable` to re-render unnecessarily.
  const onRowClick = useCallback(
    (facility: any) => viewFacilityDialog.open(facility.id),
    [viewFacilityDialog],
  );

  const pagination = useMemo(
    () => ({
      currentPage: page,
      totalPages: data?.meta?.totalPages || 1,
      totalItems: data?.meta?.total || 0,
      pageSize: limit,
      onPageChange: facilitiesPagination.goTo,
      onNextPage: facilitiesPagination.next,
      onPreviousPage: facilitiesPagination.previous,
      canNextPage: page < (data?.meta?.totalPages || 1),
      canPreviousPage: page > 1,
    }),
    [page, data, facilitiesPagination],
  );

  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title={sectionTitle}
        Icon={PlusCircleIcon}
        description=""
        hasButton
        buttonLabel="Add Facility"
        onButtonClick={() => {
          console.log("Button clciked");
          addFacilityDialog.open();
        }}
      />

      {isLoading ? (
        <div className="w-full h-30 flex items-center justify-center gap-2">
          <Loader2 size={24} className="animate-spin" />
          Loading Facilities...
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            label="Total Registered"
            value={data?.meta?.total || 0}
            onClick={() => handleStatusChange(null)}
            active={!currentStatus}
          />
          <StatsCard
            label="Active"
            value={data?.analytics?.active || 0}
            variant="success"
            onClick={() => handleStatusChange("active")}
            active={currentStatus === "active"}
          />
          <StatsCard
            label="Pending"
            value={data?.analytics?.pending || 0}
            variant="warning"
            onClick={() => handleStatusChange("pending")}
            active={currentStatus === "pending"}
          />
          <StatsCard
            label="Inactive"
            value={data?.analytics?.inactive || 0}
            variant="neutral"
            onClick={() => handleStatusChange("inactive")}
            active={currentStatus === "inactive"}
          />
          <StatsCard
            label="Rejected"
            value={data?.analytics?.rejected || 0}
            variant="red"
            onClick={() => handleStatusChange("rejected")}
            active={currentStatus === "rejected"}
          />
        </div>
      )}

      <DataTable
        columns={facilityColumns}
        data={data?.facilities || []}
        cardConfig={facilityCardConfig}
        onRowClick={onRowClick}
        pagination={pagination}
        isLoading={isLoading}
      />

      <AddFacilityDialog />
      <FacilityViewDialog />
    </section>
  );
};

export default FacilityPage;
