"use client";
import { StatsCard, TableSkeleton } from "@/components/Data-Table/helpers";
import SectionHeader from "@/components/SectionHeader";
import { Input } from "@/components/ui/input";
import { PlusSquare, Search } from "lucide-react";
import React, { useState } from "react";
import AddFacilityDialog from "@/app/(dashboard)/facilities/_components/add-facility-dialog";
import MarketingDialog from "./_components/marketing-dialog";
import { trpc } from "@/lib/trpc";
import { createPaginationHandlers } from "@/lib/utils";
import { marketingColumns } from "@/components/Data-Table/marketingColumns";
import { DataTable } from "@/components/Data-Table/data-table";
import { marketingCardConfig } from "@/components/Data-Table/mobile-table-configs/marketingCardConfig";

import { MarketingViewDialog } from "@/components/dialogs/MarketingViewDialog";
import {
  useAddMarketingDialog,
  useViewMarketingDialog,
} from "@/stores/dialog-store";
import AddMarketingDialog from "./_components/marketing-dialog";

const MarketingPage = () => {
  const addMarket = useAddMarketingDialog();
  const viewMarket = useViewMarketingDialog();

  const [adsSearch, setAdsSearch] = useState("");
  const [adsPage, setAdsPage] = useState(1);
  //   const [openDialog, setOpenDialog] = useState(false);
  const limit = 10;

  // Call trpc procedure
  const { data: adsData, isLoading } =
    trpc.marketingProfiles.getCampaigns.useQuery({
      search: adsSearch,
      page: adsPage,
      limit: limit,
      status: "active",
    });

  const adsPagination = createPaginationHandlers(
    adsPage,
    setAdsPage,
    adsData?.totalPages
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
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by headline or organization"
                  className="pl-9 w-full"
                  value={adsSearch}
                  onChange={(e) => {
                    setAdsSearch(e.target.value);
                    setAdsPage(1); // Reset to page 1 on search
                  }}
                />
              </div>

              {/* Filters */}
              {/* <Button
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </Button> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard label="Total Campaigns" value={adsData?.total || 0} />
              <StatsCard
                label="Draft"
                value={adsData?.stats?.draft || 0}
                variant="neutral"
              />
              <StatsCard
                label="Scheduled"
                value={adsData?.stats?.scheduled || 0}
                variant="info"
              />
              <StatsCard
                label="Live"
                value={adsData?.stats?.live || 0}
                variant="success"
              />
              <StatsCard
                label="Paused"
                value={adsData?.stats?.paused || 0}
                variant="warning"
              />
              <StatsCard
                label="Ended"
                value={adsData?.stats?.ended || 0}
                variant="red"
              />
            </div>

            {/* ✅ Pass data and handlers to DataTable */}

            <DataTable
              columns={marketingColumns}
              data={adsData?.campaigns || []}
              cardConfig={marketingCardConfig}
              onRowClick={(campaign) => viewMarket.open(campaign.id)}
              pagination={{
                currentPage: adsPage,
                totalPages: adsData?.totalPages || 1,
                totalItems: adsData?.total || 0,
                pageSize: limit,
                onPageChange: adsPagination.goTo,
                onNextPage: adsPagination.next,
                onPreviousPage: adsPagination.previous,
                canNextPage: adsPage < (adsData?.totalPages || 1),
                canPreviousPage: adsPage > 1,
              }}
              isLoading={isLoading} // Show loading indicator during refetch
            />
          </>
        )}

        <MarketingViewDialog />
        <AddMarketingDialog />
      </section>
    </div>
  );
};

export default MarketingPage;
