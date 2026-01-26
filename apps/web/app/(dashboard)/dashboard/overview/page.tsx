"use client";
import React, { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import {
  PlusCircleIcon,
  Hospital,
  Users,
  UserStar,
  Megaphone,
  Pill,
  Download,
  Activity,
  UserCheck,
  Smartphone,
  Calendar,
  Clock,
  LayoutDashboard,
} from "lucide-react";

// Shadcn UI (Assuming these components exist in your lib)
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Recharts for At-a-glance trends
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import { useGetDashboardOverviewStats } from "@/hooks/supabase-calls/useDashboard";
import DashBoardStatsCard from "../_components/DashBoardStatsCard";

type TimeFilter = "weekly" | "monthly" | "yearly";

//TODO: Write CronJob that will fetch the app downloads fom playstore and app store and write them to the table download_stats
export default function OverviewPage() {
  const [filter, setFilter] = useState<TimeFilter>("monthly");
  const { data, isLoading } = useGetDashboardOverviewStats(filter);

  // console.log("Data: ", data);

  if (isLoading)
    return (
      <div className="p-10 text-center font-medium">
        Loading Real-time Data...
      </div>
    );

  return (
    <section className="container mx-auto lg:px-4 py-4 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <SectionHeader
          title="Dashboard Overview"
          Icon={LayoutDashboard}
          description="Real-time monitoring of facilities, user health metrics, and platform growth."
          hasButton={false}
        />

        {/* Time Filter Tabs */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as TimeFilter)}
          className="w-fit"
        >
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 border">
            <TabsTrigger value="weekly" className="text-xs">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 1. Core KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashBoardStatsCard
          Icon={Download}
          title="Total App Downloads"
          value={data?.downloads?.total ?? 0}
          href="/analytics"
          variant="success"
        />
        <DashBoardStatsCard
          Icon={Activity}
          title="Live Online Users"
          value={data?.online_users?.total ?? 0}
          href="/users"
          variant="cyan"
          // description={`${data?.online_users?.male} M / ${data?.online_uses?.female} F`}
        />
        <DashBoardStatsCard
          Icon={Hospital}
          title="Total Facilities"
          value={data?.total_facilities ?? 0}
          href="/facilities"
          variant="success"
        />
        <DashBoardStatsCard
          Icon={Pill}
          title="Active Reminders"
          value={data?.med_reminders?.total ?? 0}
          href="/medications"
          variant="orange"
          // description={`${data?.med_reminders?.female} Females active`}
        />
      </div>

      {/* 2. Visual Trends (At-a-glance Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2 shadow-sm border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Platform Growth
              Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trends ?? []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total_users"
                  stroke="#059669"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Breakdown Mini Chart */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              User Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
            {/* Simplified Bar for quick reading */}
            <ResponsiveContainer width="100%" height="80%">
              <BarChart
                data={[
                  { name: "Male", count: data?.online_users?.male },
                  { name: "Female", count: data?.online_users?.female },
                ]}
              >
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="count"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Supporting Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <DashBoardStatsCard
          Icon={UserStar}
          title="New Signups"
          value={data?.total_users ?? 0}
          variant="alt-success"
          href=""
        />
        <DashBoardStatsCard
          Icon={Smartphone}
          title="Play Store"
          value={data?.downloads?.play_store ?? 0}
          variant="cyan"
          href=""
        />
        <DashBoardStatsCard
          Icon={UserCheck}
          href={"/symptoms"}
          title="Total Symptoms"
          value={data?.total_symptoms ?? 0}
          variant="orange"
        />
        <DashBoardStatsCard
          Icon={Megaphone}
          href={"/conditions"}
          title="Conditions"
          value={data?.total_conditions ?? 0}
          variant="cyan"
        />
        <DashBoardStatsCard
          Icon={Activity}
          href={"/healthy-living"}
          title="Healthy Living"
          value={data?.total_healthy_living ?? 0}
          variant="success"
        />
      </div>
    </section>
  );
}
