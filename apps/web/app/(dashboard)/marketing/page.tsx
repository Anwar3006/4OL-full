"use client";
import { StatsCard, TableSkeleton } from "@/components/Data-Table/helpers";
import SectionHeader from "@/components/SectionHeader";
import { Input } from "@/components/ui/input";
import { PlusSquare, Search } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import { createPaginationHandlers } from "@/lib/utils";

import { DataTable } from "@/components/Data-Table/data-table";
import { marketingCardConfig } from "@/components/Data-Table/mobile-table-configs/marketingCardConfig";

import {
  useAddMarketingDialog,
  useViewMarketingDialog,
} from "@/stores/dialog-store";
import AddMarketingDialog from "./_components/add-marketing-dialog";
import { useMarketingProfiles } from "@/hooks/supabase-calls/useMarketing";
import { marketingColumns } from "@/components/Data-Table/columns/marketingColumns";
import { ViewMarketingDialog } from "./_components/view-marketing-dialog";

const MarketingPage = () => {
  const addMarket = useAddMarketingDialog();
  const viewMarket = useViewMarketingDialog();

  const [adsSearch, setAdsSearch] = useState("");
  const [adsPage, setAdsPage] = useState(1);
  const limit = 10;

  // Call hook
  const { data: adsData, isLoading } = useMarketingProfiles({
    search: adsSearch,
    page: adsPage,
    limit: limit,
    status: "live",
  });

  const adsPagination = useMemo(
    () =>
      createPaginationHandlers(adsPage, setAdsPage, adsData?.meta.totalPages),
    [adsPage, adsData?.meta.totalPages],
  );

  // ⚡ Bolt Optimization: Memoize props for the `DataTable` component.
  // `useCallback` and `useMemo` prevent these props from being recreated on every render,
  // which would otherwise cause the memoized `DataTable` to re-render unnecessarily.
  const onRowClick = useCallback(
    (campaign: any) => viewMarket.open(campaign.id),
    [viewMarket],
  );

  const pagination = useMemo(
    () => ({
      currentPage: adsPage,
      totalPages: adsData?.meta.totalPages || 1,
      totalItems: adsData?.meta.total || 0,
      pageSize: limit,
      onPageChange: adsPagination.goTo,
      onNextPage: adsPagination.next,
      onPreviousPage: adsPagination.previous,
      canNextPage: adsPage < (adsData?.meta.totalPages || 1),
      canPreviousPage: adsPage > 1,
    }),
    [adsPage, adsData, adsPagination],
  );

  const fetchingAds = false;
  return (
    <div className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <section>
        <SectionHeader
          title="Marketing & Advertising"
          description="Manage your marketing and advertising campaigns."
          Icon={PlusSquare}
          hasButton
          buttonLabel="Add Campaign"
          onButtonClick={() => addMarket.open()}
        />

        {fetchingAds ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by headline or organization"
                  className="pl-9 w-full"
                  value={adsSearch}
                  onChange={(e) => {
                    setAdsSearch(e.target.value);
                    setAdsPage(1);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                label="Total Campaigns"
                value={adsData?.meta.total || 0}
              />
              <StatsCard
                label="Draft"
                value={adsData?.analytics?.draft || 0}
                variant="neutral"
              />
              <StatsCard
                label="Scheduled"
                value={adsData?.analytics?.scheduled || 0}
                variant="info"
              />
              <StatsCard
                label="Live"
                value={adsData?.analytics?.live || 0}
                variant="success"
              />
              <StatsCard
                label="Paused"
                value={adsData?.analytics?.paused || 0}
                variant="warning"
              />
              <StatsCard
                label="Ended"
                value={adsData?.analytics?.ended || 0}
                variant="red"
              />
            </div>

            <DataTable
              columns={marketingColumns}
              data={adsData?.data || []}
              cardConfig={marketingCardConfig}
              onRowClick={onRowClick}
              pagination={pagination}
              isLoading={isLoading}
            />
          </>
        )}

        <ViewMarketingDialog />
        <AddMarketingDialog />
      </section>
    </div>
  );
};

export default MarketingPage;
