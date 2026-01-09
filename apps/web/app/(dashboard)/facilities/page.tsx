"use client";

import {
  Hospital,
  Loader2,
  PlusCircleIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import React from "react";

import { trpc } from "@/lib/trpc";

import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/Data-Table/helpers";
import { FACILITY_TYPE_OPTIONS } from "@4ol/db/types/formInput";
import { useAddFacilityDialog } from "@/stores/dialog-store";
import AddFacilityDialog from "./_components/add-facility-dialog";
import { FacilityViewDialog } from "@/components/dialogs/FacilityViewDialog";
import { useFacilityProfiles } from "@/hooks/supabase-calls/useFacilities";

const FacilitiesPage = () => {
  const addFacility = useAddFacilityDialog();

  const { data, isLoading } = useFacilityProfiles({
    includeStatsOnly: true,
  });

  console.log("facilites ", data);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-10">
      {/* Admins Table */}
      <div className="mb-5">
        <SectionHeader
          title="Facilities"
          description=""
          Icon={PlusCircleIcon}
          buttonLabel="Add Facility"
          hasButton
          onButtonClick={() => addFacility.open()}
        />

        {/* StatsCard */}
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
            />
            <StatsCard
              label="Active"
              value={data?.analytics?.active || 0}
              variant="success"
            />
            <StatsCard
              label="Pending"
              value={data?.analytics?.pending || 0}
              variant="warning"
            />
            <StatsCard
              label="Inactive"
              value={data?.analytics?.inactive || 0}
              variant="neutral"
            />
            <StatsCard
              label="Rejected"
              value={data?.analytics?.rejected || 0}
              variant="red"
            />
          </div>
        )}

        {/*  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
          {FACILITY_TYPE_OPTIONS.map(({ value, label }) => (
            <FacilityCard
              key={value}
              label={label}
              link={`/facilities/${value}`}
              Icon={Hospital}
            />
          ))}
        </div>
      </div>

      <AddFacilityDialog />
    </section>
  );
};

export default FacilitiesPage;

type FacilityCardProps = {
  label: string;
  link: string;
  Icon: any;
};
const FacilityCard = ({ label, link, Icon }: FacilityCardProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(link)}
      className="group relative flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white 
                 hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm 
                 transition-all duration-300 ease-in-out text-left w-full"
    >
      {/* Icon Container: Larger and softer colors */}
      <div
        className="flex items-center justify-center shrink-0 size-14 rounded-xl bg-green-50 
                      group-hover:bg-green-100 transition-colors duration-300"
      >
        <Icon className="h-6 w-6 text-green-600 group-hover:text-green-700" />
      </div>

      {/* Content Area: Consistent typography */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">
          {label}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-500">
          <SquareArrowOutUpRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          />
          <span className="text-[10px] uppercase tracking-wider font-medium truncate">
            View {label}
          </span>
        </div>
      </div>

      {/* Subtle indicator for interactivity */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="size-1.5 rounded-full bg-green-500" />
      </div>
    </button>
  );
};
