"use client";
import SectionHeader from "@/components/SectionHeader";
import {
  Hospital,
  Megaphone,
  Pill,
  PlusCircleIcon,
  UserCircleIcon,
  Users,
  UserStar,
} from "lucide-react";
import React from "react";
import DashBoardStatsCard from "./_components/DashBoardStatsCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import MedicalNetworkGrowth from "./_components/charts/MedicalNetworkGrowth";
import ConditionCategoriesChart from "./_components/charts/ConditionCategories";
import { useGetDashboardStats } from "@/hooks/supabase-calls/useDashboard";

// Mock Data for visualization
const conditionData = [
  { name: "Digestive", count: 45 },
  { name: "Respiratory", count: 32 },
  { name: "Nervous", count: 28 },
  { name: "Circulatory", count: 24 },
  { name: "Skeletal", count: 18 },
];

const DashboardPage = () => {
  const { data, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("Data: ", data);
  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title={"Dashboard Overview"}
        Icon={PlusCircleIcon}
        description="Real-time monitoring of facilities, user health metrics, and platform growth."
        hasButton={false}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashBoardStatsCard
          Icon={Hospital}
          title="Total Registered Facilities"
          value={data.live.total_facilities}
          href="/facilities"
          variant="success"
        />
        <DashBoardStatsCard
          Icon={PlusCircleIcon}
          title="Facilities Pending Approval"
          value={data?.live.pending_facilities}
          href="/facilities"
          variant="warning"
        />
        <DashBoardStatsCard
          Icon={Users}
          title="Total Registered Users"
          value={data.live.total_users}
          href="/users"
          variant="success"
        />
        <DashBoardStatsCard
          Icon={UserStar}
          title="Active Users (24h)"
          value={data.live.active_users_24h}
          href="/users"
          variant="primary"
        />
        <DashBoardStatsCard
          Icon={UserStar}
          title="Active Users (30days)"
          value={data.live.active_users_30d}
          href="/users"
          variant="default"
        />
        <DashBoardStatsCard
          Icon={UserCircleIcon}
          title="New Signups (Today)"
          value={data.live.new_signups_today}
          href="/users"
          variant="default"
        />
        <DashBoardStatsCard
          Icon={UserCircleIcon}
          title="Demographic Count (Male)"
          value={data.live.male_count}
          href="/users"
          variant="default"
        />
        <DashBoardStatsCard
          Icon={UserCircleIcon}
          title="Demographic Count (Female)"
          value={data.live.female_count}
          href="/users"
          variant="default"
        />
        <DashBoardStatsCard
          Icon={Megaphone}
          title="Total Live Campaigns"
          value="0"
          href="/marketing"
          variant="success"
        />
        <DashBoardStatsCard
          Icon={Pill}
          title="Active Medication Reminders"
          value="0"
          href="/marketing"
          variant="primary"
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Affected Body Systems - Bar Chart */}
        <div className="lg:col-span-1 p-4 bg-white rounded-xl border shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">
            Top Affected Systems
          </h3>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conditionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  fontSize={12}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="count"
                  fill="#059669"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Condition Categories */}
        <div className="lg:col-span-1 p-4 bg-white rounded-xl border shadow-sm">
          <ConditionCategoriesChart />
        </div>
      </div>
      {/* Growth Trends - Area Chart */}
      <div className="lg:col-span-2 p-6 bg-white rounded-xl border shadow-sm">
        <MedicalNetworkGrowth />
      </div>
    </section>
  );
};

export default DashboardPage;
