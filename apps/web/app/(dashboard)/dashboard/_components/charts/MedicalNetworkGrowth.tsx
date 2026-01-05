import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type Props = {};
const MedicalNetworkGrowth = ({}: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-700">
            Medical Network Growth
          </h3>
          <p className="text-muted-foreground text-xs">
            Trend of registered facilities
          </p>
        </div>
        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">
          Live updates
        </span>
      </div>
      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={[
              { d: "1", v: 10 },
              { d: "5", v: 25 },
              { d: "10", v: 20 },
              { d: "15", v: 45 },
            ]}
          >
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="d" hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#059669"
              fillOpacity={1}
              fill="url(#colorVal)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MedicalNetworkGrowth;
