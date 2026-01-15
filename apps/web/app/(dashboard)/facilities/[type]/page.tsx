"use client";
import SectionHeader from "@/components/SectionHeader";
import { trpc } from "@/lib/trpc";
import { useParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import AddFacilityDialog from "../_components/add-facility-dialog";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { StatsCard } from "@/components/Data-Table/helpers";
import { DataTable } from "@/components/Data-Table/data-table";
import { createPaginationHandlers } from "@/lib/utils";
import { facilityColumns } from "@/components/Data-Table/columns/facilityColumns";
import { facilityCardConfig } from "@/components/Data-Table/mobile-table-configs/facilityCardConfig";
import { FacilityViewDialog } from "@/components/dialogs/FacilityViewDialog";
import {
  useAddFacilityDialog,
  useViewFacilityDialog,
} from "@/stores/dialog-store";

const FacilityPage = () => {
  const params = useParams();
  const type = decodeURIComponent(params.type as string);
  const addFacilityDialog = useAddFacilityDialog();
  const viewFacilityDialog = useViewFacilityDialog();

  const [page, setPage] = React.useState(1);
  const limit = 10;
  const facilitiesPagination = createPaginationHandlers(page, setPage);

  const { data, isLoading } = trpc.facilityProfiles.getFacilities.useQuery({
    type: type,
  });

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
    [viewFacilityDialog]
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
    [page, data, facilitiesPagination]
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
          <StatsCard label="Total Registered" value={data?.meta?.total || 0} />
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
          <StatsCard
            label="Rejected"
            value={data?.stats?.rejected || 0}
            variant="red"
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
