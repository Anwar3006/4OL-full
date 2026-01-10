"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Mail, Phone, BriefcaseBusiness } from "lucide-react";
import { TMarketingProfileOutput } from "@4ol/db/schemas/marketing-profile.schema";
import { MarkrtingStatusMap } from "@/constants/marketing.const";

export const marketingColumns: ColumnDef<TMarketingProfileOutput>[] = [
  {
    accessorKey: "type",
    header: () => <div className="font-semibold">Type</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-18">
        <div className="font-medium text-sm">
          {row.original.marketingType.toLocaleUpperCase()}
        </div>
        {/* Show headline on mobile as subtitle
        <div className="text-xs text-muted-foreground md:hidden truncate">
          {row.original.email}
        </div> */}
      </div>
    ),
  },
  {
    accessorKey: "headline",
    header: () => (
      <div className="font-semibold hidden md:table-cell">Headline</div>
    ),
    cell: ({ row }) => (
      <div className="hidden md:table-cell min-w-40">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm truncate">{row.original.headline}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "organization",
    header: () => (
      <div className="font-semibold hidden lg:table-cell">Organization</div>
    ),
    cell: ({ row }) => (
      <div className="hidden lg:table-cell min-w-35">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.original.organization}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold">Status</div>,
    cell: ({ row }) => (
      <div className="min-w-16">{MarkrtingStatusMap[row.original.status]}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: () => <div className="font-semibold">Start Date</div>,
    cell: ({ row }) => <div className="min-w-25">{row.original.startDate}</div>,
  },
  {
    accessorKey: "endDate",
    header: () => <div className="font-semibold">End Date</div>,
    cell: ({ row }) => <div className="min-w-25">{row.original.endDate}</div>,
  },
];
