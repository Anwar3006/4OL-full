import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

type DashBoardStatsCard = {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  value: string | number;
  href: string;
  variant?: string;
};

const VARIANT_MAP = {
  default: "border-zinc-300",
  primary: "border-sky-600",
  secondary: "border-amber-500",
  success: "border-green-700",
  warning: "border-red-500",
} as any;

const DashBoardStatsCard = ({
  Icon,
  title,
  value,
  href,
  variant = "default",
}: DashBoardStatsCard) => {
  return (
    <div
      className={cn(
        VARIANT_MAP[variant],
        "border-2 bg-gray-50 px-3 md:px-4 py-2 rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-700 ease-in-out"
      )}
    >
      <Link href={href}>
        <div className="flex items-center gap-2">
          <Icon className="size-6 md:size-8 " />

          <div className="flex-1 min-w-0 flex items-start flex-col">
            <p className="text-base md:text-lg font-semibold truncate">
              {value}
            </p>
            <p className="text-muted-foreground text-xs font-semibold ">
              {title}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DashBoardStatsCard;
