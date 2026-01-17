"use client";
import SectionHeader from "@/components/SectionHeader";
import { PlusCircleIcon } from "lucide-react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import ConditionsStats from "../diseases_&_conditions/_components/ConditionStats";
import {
  useAddConditionDialog,
  useViewConditionDialog,
} from "@/stores/dialog-store";
import AddSymptomDialog from "./_components/add-symptom-dialog";
import ViewSymptomDialog from "./_components/view-symptom-dialog";
import { createPaginationHandlers } from "@/lib/utils";
import { DataTable } from "@/components/Data-Table/data-table";
import { symptomsColumns } from "@/components/Data-Table/columns/symptomsColumns";
import { useSymptoms } from "@/hooks/supabase-calls/useSymptoms";

const SymptomsPage = () => {
  const addSymptom = useAddConditionDialog();
  const viewSymptom = useViewConditionDialog();

  const limit = 10;
  const [page, setPage] = useState<number>(1);
  const [bodyPart, setBodyPart] = useState<string | null>();

  //============== Supabase hook invocation
  const { data, isLoading } = useSymptoms({
    limit,
    page,
  });

  const pagination = useMemo(
    () => createPaginationHandlers(page, setPage, data?.meta.totalPages),
    [page, data?.meta.totalPages]
  );

  useEffect(() => {
    if (data?.analytics?.mostAffectedBodyParts) {
      const bodyPart = data?.analytics?.mostAffectedBodyParts[0]?.name;
      setBodyPart(bodyPart);
    }
  }, [data]);

  // ⚡ Bolt Optimization: Memoize props for the `DataTable` component.
  // `useCallback` and `useMemo` prevent these props from being recreated on every render,
  // which would otherwise cause the memoized `DataTable` to re-render unnecessarily.
  const onRowClick = useCallback(
    (condition: any) => viewSymptom.open(condition.id),
    [viewSymptom]
  );

  const paginationConfig = useMemo(
    () => ({
      currentPage: page,
      totalPages: data?.meta?.totalPages || 1,
      totalItems: data?.meta?.total || 0,
      pageSize: limit,
      onPageChange: pagination.goTo,
      onNextPage: pagination.next,
      onPreviousPage: pagination.previous,
      canNextPage: page < (data?.meta?.totalPages || 1),
      canPreviousPage: page > 1,
    }),
    [page, data, pagination]
  );

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
        onRowClick={onRowClick}
        pagination={paginationConfig}
        isLoading={isLoading}
      />

      <AddSymptomDialog />
      <ViewSymptomDialog />
    </section>
  );
};

export default SymptomsPage;
