"use client";
import SectionHeader from "@/components/SectionHeader";
import {
  PlusCircleIcon,
  Hospital,
  Users,
  UserStar,
  UserCircleIcon,
  Megaphone,
  Pill,
} from "lucide-react";

import { useGetDashboardStats } from "@/hooks/supabase-calls/useDashboard";
import DashBoardStatsCard from "../_components/DashBoardStatsCard";

export default function OverviewPage() {
  const { data, isLoading } = useGetDashboardStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title="Dashboard Overview"
        Icon={PlusCircleIcon}
        description="Real-time monitoring of facilities, user health metrics, and platform growth."
        hasButton={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashBoardStatsCard
          Icon={Hospital}
          title="Total Registered Facilities"
          value={data?.live?.total_facilities ?? 0}
          href="/facilities"
          variant="success"
        />
        <DashBoardStatsCard
          Icon={PlusCircleIcon}
          title="Facilities Pending Approval"
          value={data?.live?.pending_facilities ?? 0}
          href="/facilities"
          variant="warning"
        />
        <DashBoardStatsCard
          Icon={Users}
          title="Total Registered Users"
          value={data?.live?.total_users ?? 0}
          href="/users"
          variant="success"
        />
        <DashBoardStatsCard
          Icon={UserStar}
          title="Active Users (24h)"
          value={data?.live?.active_users_24h ?? 0}
          href="/users"
          variant="cyan"
        />
        <DashBoardStatsCard
          Icon={UserStar}
          title="Active Users (30days)"
          value={data?.live?.active_users_30d ?? 0}
          href="/users"
          variant="cyan"
        />
        <DashBoardStatsCard
          Icon={UserCircleIcon}
          title="New Signups (Today)"
          value={data?.live?.new_signups_today ?? 0}
          href="/users"
          variant="alt-success"
        />
        <DashBoardStatsCard
          Icon={UserCircleIcon}
          title="Demographic Count (Male)"
          value={data?.live?.male_count ?? 0}
          href="/users"
          variant="orange"
        />
        <DashBoardStatsCard
          Icon={UserCircleIcon}
          title="Demographic Count (Female)"
          value={data?.live?.female_count ?? 0}
          href="/users"
          variant="orange"
        />
        <DashBoardStatsCard
          Icon={Megaphone}
          title="Total Live Campaigns"
          value="0"
          href="/marketing"
          variant="cyan"
        />
        <DashBoardStatsCard
          Icon={Pill}
          title="Active Medication Reminders"
          value="0"
          href="/marketing"
          variant="cyan"
        />
      </div>
    </section>
  );
}
