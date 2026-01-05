"use client";
import SectionHeader from "@/components/SectionHeader";
import { PlusCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import ConditionsStats from "../diseases_&_conditions/_components/ConditionStats";
import {
  useAddConditionDialog,
  useViewConditionDialog,
} from "@/stores/dialog-store";
import AddSymptomDialog from "./_components/add-symptom-dialog";
import { trpc } from "@/lib/trpc";
import ViewSymptomDialog from "./_components/view-symptom-dialog";
import { createPaginationHandlers } from "@/lib/utils";
import { DataTable } from "@/components/Data-Table/data-table";
import { symptomsColumns } from "@/components/Data-Table/columns/symptomsColumns";

const SymptomsPage = () => {
  const addSymptom = useAddConditionDialog();
  const viewSymptom = useViewConditionDialog();

  const limit = 10;
  const [page, setPage] = useState<number>(1);
  const [bodyPart, setBodyPart] = useState<string | null>();

  //============== TRPC calls
  const { data, isLoading } = trpc.symptomsRouter.getAll.useQuery({
    limit,
    page,
  });

  const pagination = createPaginationHandlers(page, setPage);

  useEffect(() => {
    if (data?.analytics?.mostAffectedBodyParts) {
      const bodyPart = data?.analytics?.mostAffectedBodyParts[0]?.name;
      setBodyPart(bodyPart);
    }
  }, [data]);

  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title={"Symptoms"}
        Icon={PlusCircleIcon}
        description="Manage independent symptoms"
        hasButton
        buttonLabel="Add Symptom"
        onButtonClick={() => addSymptom.open()}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ConditionsStats
          label="Total Record Symptoms"
          value={data?.meta?.total || 0}
          isLoading={isLoading}
        />
        <ConditionsStats
          label="Total Condition Categories"
          value={data?.analytics?.totalCategories || 0}
          isLoading={isLoading}
        />
        <ConditionsStats
          label="Most Affected Body Part"
          value={bodyPart || "N/A"}
          isLoading={isLoading}
        />
      </div>

      <DataTable
        columns={symptomsColumns}
        data={data?.symptoms || []}
        // cardConfig={conditionCardConfig}
        onRowClick={(condition: any) => viewSymptom.open(condition.id)}
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

      {/* Dialogs */}
      <AddSymptomDialog />
      <ViewSymptomDialog />
    </section>
  );
};

export default SymptomsPage;
