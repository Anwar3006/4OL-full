"use client";
import SectionHeader from "@/components/SectionHeader";
import { PlusCircleIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import ConditionsStats from "../diseases_&_conditions/_components/ConditionStats";
import { DataTable } from "@/components/Data-Table/data-table";

import { createPaginationHandlers } from "@/lib/utils";
import {
  useAddHealthyLivingDialog,
  useViewHealthyLivingDialog,
} from "@/stores/dialog-store";
import { healthyLivingColumns } from "@/components/Data-Table/columns/healthyLivingColumns";
import { healthyLivingCardConfig } from "@/components/Data-Table/mobile-table-configs/healthyLivingCardConfig";
import AddHealthyLivingDialog from "./_components/add-healthyLiving-dialog";
import { useHealthyLivings } from "@/hooks/supabase-calls/useHealthyLiving";
import ViewHealthyLivingDialog from "./_components/view-healthyLiving-dialog";

const HealthyLivingPage = () => {
  const addHealthLiving = useAddHealthyLivingDialog();
  const viewHealthyLiving = useViewHealthyLivingDialog();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useHealthyLivings({ page, limit });

  const pagination = useMemo(
    () => createPaginationHandlers(page, setPage, data?.meta.totalPages),
    [page, data?.meta.totalPages]
  );

  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title={"Healthy Living"}
        Icon={PlusCircleIcon}
        description="Manage the information related to healthy living"
        hasButton
        buttonLabel="Add Notes"
        onButtonClick={() => addHealthLiving.open()}
      />

      {/* StatsCards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ConditionsStats
          label="Total Recorded"
          value={data?.meta?.total || 0}
          isLoading={isLoading}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={healthyLivingColumns}
        data={data?.healthyLivings || []}
        cardConfig={healthyLivingCardConfig}
        // route="facilities"
        onRowClick={(condition: any) => viewHealthyLiving.open(condition.id)}
        pagination={{
          currentPage: page,
          totalPages: data?.meta?.totalPages || 1,
          totalItems: data?.meta?.total || 0,
          pageSize: limit,
          onPageChange: pagination.goTo,
          onNextPage: pagination.next,
          onPreviousPage: pagination.previous,
          canNextPage: page < (data?.meta?.totalPages || 1),
          canPreviousPage: page > 1,
        }}
        isLoading={isLoading}
      />

      <AddHealthyLivingDialog />
      <ViewHealthyLivingDialog />
    </section>
  );
};

export default HealthyLivingPage;
