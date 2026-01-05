"use client";
import { DataTable } from "@/components/Data-Table/data-table";
import SectionHeader from "@/components/SectionHeader";
import { cn, createPaginationHandlers } from "@/lib/utils";
import {
  useAddConditionDialog,
  useViewConditionDialog,
} from "@/stores/dialog-store";
import { Loader2, PlusCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddConditionDialog from "./_components/add-condition-dialog";
import { trpc } from "@/lib/trpc";
import { conditionColumns } from "@/components/Data-Table/columns/conditionColumns";
import { conditionCardConfig } from "@/components/Data-Table/mobile-table-configs/conditionCardConfig";
import { ViewConditionDialog } from "./_components/view-condition-dialog";
import ConditionsStats from "./_components/ConditionStats";

const DiseasesAndConditionsPage = () => {
  const addConditions = useAddConditionDialog();
  const viewConditions = useViewConditionDialog();
  const [page, setPage] = useState(1);
  const [bodyPart, setBodyPart] = useState<string | null>();
  const limit = 10;

  const { data: allConditions, isLoading } =
    trpc.conditionsRouter.getAll.useQuery({
      page,
      limit,
    });
  const conditionsPagination = createPaginationHandlers(page, setPage);

  useEffect(() => {
    if (allConditions?.analytics?.mostAffectedBodyParts) {
      const bodyPart = allConditions?.analytics?.mostAffectedBodyParts[0]?.name;
      setBodyPart(bodyPart);
    }
  }, [allConditions]);

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ConditionsStats
          label="Total Registered"
          value={allConditions?.meta?.total || 0}
          isLoading={isLoading}
        />
        <ConditionsStats
          label="Total Condition Categories"
          value={allConditions?.analytics?.totalCategories || 0}
          isLoading={isLoading}
        />
        <ConditionsStats
          label="Most Affected Body Part"
          value={bodyPart || "N/A"}
          isLoading={isLoading}
        />
        <ConditionsStats
          label="Most Recurring Category"
          value={"Cancer"}
          isLoading={isLoading}
        />
        {/* <ConditionsStats label="Total Register" value={3} /> */}
      </div>

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
