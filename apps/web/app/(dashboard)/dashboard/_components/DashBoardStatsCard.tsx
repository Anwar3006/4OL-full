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
  href?: string;
  variant?: "success" | "cyan" | "orange" | "alt-success" | string;
  description?: string; // Added for extra context like "12 Males / 8 Females"
};

const VARIANT_MAP: Record<string, string> = {
  success:
    "bg-[#c7f2d7] border-[#b0e6c3] text-emerald-900 shadow-emerald-100/50",
  cyan: "bg-[#E5F9FF] border-[#d1f2fb] text-cyan-900 shadow-cyan-100/50",
  orange: "bg-[#FFEDE5] border-[#fbdcd0] text-orange-900 shadow-orange-100/50",
  "alt-success":
    "bg-[#c7f2d7] border-[#b0e6c3] text-emerald-900 shadow-emerald-100/50",
  default: "bg-gray-50 border-zinc-200 text-zinc-900 shadow-zinc-100/50",
};

const DashBoardStatsCard = ({
  Icon,
  title,
  value,
  href,
  description,
  variant = "default",
}: DashBoardStatsCardProps) => {
  return (
    <Link
      href={href || "#"}
      className={cn(
        VARIANT_MAP[variant] || VARIANT_MAP.default,
        // Responsive Container: Scaling padding and height from mobile to 3XL
        "group relative flex flex-col justify-center border-2 transition-all duration-500 ease-in-out overflow-hidden",
        "p-3 md:p-4 lg:p-5 2xl:p-10", // Progressive Padding
        "rounded-[2rem] 2xl:rounded-[3rem]", // More rounded on huge screens
        "min-h-[120px] md:min-h-[140px] 2xl:min-h-[200px]", // Fluid Height
        "shadow-sm hover:shadow-2xl hover:-translate-y-2", // Premium hover lift
      )}
    >
      {/* Background Decorative Element (Subtle visual polish) */}
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="size-24 md:size-32 lg:size-48" />
      </div>

      <div className="flex items-center gap-4 md:gap-3 lg:gap-4 2xl:gap-8 z-10">
        {/* Icon Container: Scales significantly on ultra-wide screens */}
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl md:rounded-3xl transition-all duration-500",
            "p-3 md:p-4 lg:p-5 2xl:p-7",
            "bg-white/50 group-hover:bg-white group-hover:rotate-6",
          )}
        >
          <Icon className="size-8 xl:size-10 2xl:size-16 stroke-[2.2px]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            {/* Value: Massive on 3XL, Bold on Mobile */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-6xl font-black tracking-tighter truncate leading-tight">
              {value}
            </h3>

            {/* Title: Uppercase for authority, scales with screen size */}
            <p className="text-sm md:text-xs lg:text-md 2xl:text-lg font-black uppercase tracking-[0.15em] opacity-60">
              {title}
            </p>

            {/* Optional Description (Sub-metrics) */}
            {description && (
              <p className="mt-1 text-[9px] md:text-[10px] lg:text-xs 2xl:text-base font-bold opacity-50 italic">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DashBoardStatsCard;
