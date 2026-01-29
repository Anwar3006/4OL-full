"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Pill,
  Clock,
  User,
  Calendar,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types based on your provided schema
export type TMedicationReminder = {
  id: string;
  user_id: string;
  drug_name: string;
  generic_name: string | null;
  rxcui: string | null;
  dosage_amount: string;
  interval_hours: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  is_enabled: boolean;
  purpose: string | null;
};

export const medicationColumns: ColumnDef<TMedicationReminder>[] = [
  {
    accessorKey: "drug_name",
    header: () => <div className="font-semibold">Medication</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-[180px]">
        <div className="font-bold text-sm flex items-center gap-2">
          <Pill className="h-3.5 w-3.5 text-primary" />
          {row.original.drug_name}
        </div>
        <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
          {row.original.generic_name || "No generic info"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "dosage_amount",
    header: () => (
      <div className="font-semibold hidden sm:table-cell">Dosage</div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell min-w-[100px]">
        <Badge variant="secondary" className="font-medium">
          {row.original.dosage_amount}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: () => (
      <div className="font-semibold hidden md:table-cell">Frequency</div>
    ),
    cell: ({ row }) => (
      <div className="hidden md:table-cell min-w-[120px]">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          Every {row.original.interval_hours}h
        </div>
      </div>
    ),
  },
  {
    accessorKey: "user_id",
    header: () => (
      <div className="font-semibold hidden lg:table-cell">User ID</div>
    ),
    cell: ({ row }) => (
      <div className="hidden lg:table-cell min-w-[140px]">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-mono truncate">
            {row.original.user_id.split("-")[0]}...
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => (
      <div className="font-semibold hidden xl:table-cell">Period</div>
    ),
    cell: ({ row }) => (
      <div className="hidden xl:table-cell min-w-[150px]">
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-600">Start:</span>
            {format(new Date(row.original.start_date), "MMM dd, yyyy")}
          </div>
          {row.original.end_date && (
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-600">End:</span>
              {format(new Date(row.original.end_date), "MMM dd, yyyy")}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "rxcui",
    header: () => (
      <div className="font-semibold hidden 2xl:table-cell">RxNorm ID</div>
    ),
    cell: ({ row }) => (
      <div className="hidden 2xl:table-cell min-w-[100px]">
        <span className="text-xs font-mono py-0.5 px-2 bg-slate-100 rounded border uppercase">
          {row.original.rxcui || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold">Status</div>,
    cell: ({ row }) => {
      const active = row.original.is_active && row.original.is_enabled;
      return (
        <div className="min-w-[100px]">
          <Badge
            variant={active ? "default" : "destructive"}
            className={cn(
              "gap-1",
              active
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-100",
            )}
          >
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse",
                active ? "bg-emerald-500" : "bg-rose-500",
              )}
            />
            {active ? "Active" : "Paused"}
          </Badge>
        </div>
      );
    },
  },
];
