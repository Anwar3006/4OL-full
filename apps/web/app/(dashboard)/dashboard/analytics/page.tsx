"use client";
import SectionHeader from "@/components/SectionHeader";
import { BarChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MedicalNetworkGrowth from "../_components/charts/MedicalNetworkGrowth";
import ConditionCategoriesChart from "../_components/charts/ConditionCategories";

const conditionData = [
  { name: "Digestive", count: 45 },
  { name: "Respiratory", count: 32 },
  { name: "Nervous", count: 28 },
  { name: "Circulatory", count: 24 },
  { name: "Skeletal", count: 18 },
];

export default function AnalyticsPage() {
  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title="Analytics Dashboard"
        Icon={BarChartIcon}
        description="Detailed insights and trends across the platform."
        hasButton={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded-xl border shadow-sm">
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

        <div className="p-4 bg-white rounded-xl border shadow-sm">
          <ConditionCategoriesChart />
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border shadow-sm">
        <MedicalNetworkGrowth />
      </div>
    </section>
  );
}
