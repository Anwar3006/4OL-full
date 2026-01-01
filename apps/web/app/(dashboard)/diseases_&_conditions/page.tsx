"use client";
import { DataTable } from "@/components/Data-Table/data-table";
import SectionHeader from "@/components/SectionHeader";
import { cn, createPaginationHandlers } from "@/lib/utils";
import {
  useAddConditionDialog,
  useViewConditionDialog,
} from "@/stores/dialog-store";
import { Loader2, PlusCircleIcon } from "lucide-react";
import React, { useState } from "react";
import AddConditionDialog from "./_components/add-condition-dialog";
import { trpc } from "@/lib/trpc";
import { conditionColumns } from "@/components/Data-Table/columns/conditionColumns";
import { conditionCardConfig } from "@/components/Data-Table/mobile-table-configs/conditionCardConfig";
import { ViewConditionDialog } from "./_components/view-condition-dialog";

const DiseasesAndConditionsPage = () => {
  const addConditions = useAddConditionDialog();
  const viewConditions = useViewConditionDialog();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: allConditions, isLoading } =
    trpc.conditionsRouter.getAll.useQuery({
      page,
      limit,
    });
  const conditionsPagination = createPaginationHandlers(page, setPage);

  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title={"Diseases & Conditions"}
        Icon={PlusCircleIcon}
        description="Manage the diseases and conditions"
        hasButton
        buttonLabel="Add Condition"
        onButtonClick={() => addConditions.open()}
      />

      {/* StatsCard */}
      {/* {isLoading ? (
        <div className="w-full h-30 flex items-center justify-center gap-2">
          <Loader2 size={24} className="animate-spin" />
          Loading Facilities...
        </div>
      ) : ( */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* <ConditionsStats label="Total Registered" value={data?.meta?.total || 0} /> */}
        <ConditionsStats label="Total Registered" value={3} />
        <ConditionsStats label="Total Number of Categories" value={3} />
        <ConditionsStats label="Most Affected Body Part" value={"Skin"} />
        <ConditionsStats label="Most Recurring Category" value={"Cancer"} />
        {/* <ConditionsStats label="Total Register" value={3} /> */}
      </div>
      {/* )} */}

      {/* Conditions Table */}
      <DataTable
        columns={conditionColumns}
        data={allConditions?.conditions || []}
        cardConfig={conditionCardConfig}
        // route="facilities"
        onRowClick={(condition: any) => viewConditions.open(condition.id)}
        pagination={{
          currentPage: page,
          totalPages: allConditions?.meta?.totalPages || 1,
          totalItems: allConditions?.meta?.total || 0,
          pageSize: limit,
          onPageChange: conditionsPagination.goTo,
          onNextPage: conditionsPagination.next,
          onPreviousPage: conditionsPagination.previous,
          canNextPage: page < (allConditions?.meta?.totalPages || 1),
          canPreviousPage: page > 1,
        }}
        isLoading={isLoading}
      />

      {/* Dialogs - These MUST be rendered for Zustand to work! */}
      <AddConditionDialog />
      <ViewConditionDialog />
    </section>
  );
};

export default DiseasesAndConditionsPage;

type ConditionsStatsProps = {
  label: string;
  value: number | string;
  borderColor?: string;
};
//Stats to track
// 1. Total Conditions
// 2. Total number of categories -> 18 Medical Categories
// 3. Number of body parts covered -> 14 Body Parts
// 4. Top Category based on number of conditions
// 5. Top Body Part based on number of conditions
const ConditionsStats = ({
  label,
  value,
  borderColor,
}: ConditionsStatsProps) => {
  return (
    <div
      className={cn("bg-white border rounded-lg p-4 border-gray-300 shadow-md")}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};
