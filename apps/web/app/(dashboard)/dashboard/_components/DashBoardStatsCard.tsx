import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

type DashBoardStatsCardProps = {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  value: string | number;
  href: string;
  variant?: "success" | "cyan" | "orange" | "alt-success" | string;
};

// 1. Refactored Map with your specific Pastel Hex codes
const VARIANT_MAP: Record<string, string> = {
  success: "bg-[#c7f2d7] border-[#b0e6c3] text-emerald-900",
  cyan: "bg-[#E5F9FF] border-[#d1f2fb] text-cyan-900",
  orange: "bg-[#FFEDE5] border-[#fbdcd0] text-orange-900",
  "alt-success": "bg-[#c7f2d7] border-[#b0e6c3] text-emerald-900",
  default: "bg-gray-50 border-zinc-200 text-zinc-900",
};

const DashBoardStatsCard = ({
  Icon,
  title,
  value,
  href,
  variant = "default",
}: DashBoardStatsCardProps) => {
  return (
    <div
      className={cn(
        VARIANT_MAP[variant] || VARIANT_MAP.default,
        // 2. Increased Card Size: added min-h and increased padding
        "group border-2 px-5 md:px-6 py-5 md:py-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-500 ease-in-out min-h-[110px] flex items-center",
      )}
    >
      <Link href={href} className="w-full">
        <div className="flex items-center gap-5">
          {/* 3. Increased Icon Size: scaled to roughly 1.2x of original */}
          <div className="p-3 rounded-2xl bg-white/40 group-hover:bg-white/60 transition-colors">
            <Icon className="size-8 md:size-10 stroke-[2.5px]" />
          </div>

          <div className="flex-1 min-w-0 flex items-start flex-col gap-0.5">
            {/* 4. Increased Text Size: Value (Large) and Title (Medium) */}
            <p className="text-2xl md:text-3xl font-black tracking-tight truncate">
              {value}
            </p>
            <p className="text-sm md:text-base font-bold opacity-70 uppercase tracking-wide">
              {title}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DashBoardStatsCard;
