"use client";

import {
  Pill,
  Clock,
  Activity,
  Info,
  Trash2,
  Power,
  Clipboard,
} from "lucide-react";
import { MobileCardConfig } from "../mobile-card-types";
import { TMedicationReminder } from "../columns/medicationReminderColumns"; // Adjust path as needed
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

/**
 * Hook-based config for Medication Reminders mobile cards.
 */
export const useMedicationReminderCardConfig = () => {
  // Assuming you have a view/edit store for medications
  // const { open: openView } = useViewMedicationDialog();

  const config: MobileCardConfig<TMedicationReminder> = {
    header: {
      title: (med) => med.drug_name,
      subtitle: (med) => med.dosage_amount,
      badge: (med) => {
        const active = med.is_active && med.is_enabled;
        return (
          <Badge
            variant={active ? "default" : "secondary"}
            className={cn(
              "text-[10px] h-5",
              active
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-slate-50 text-slate-500",
            )}
          >
            {active ? "Active" : "Paused"}
          </Badge>
        );
      },
    },

    fields: [
      {
        id: "schedule",
        icon: <Clock className="h-4 w-4 text-primary shrink-0" />,
        render: (med) => (
          <span className="font-medium">Every {med.interval_hours} hours</span>
        ),
      },
      {
        id: "purpose",
        icon: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
        render: (med) => (
          <span className="text-xs text-muted-foreground line-clamp-1 italic">
            {med.purpose || "No indication provided"}
          </span>
        ),
      },
      {
        id: "date-range",
        icon: <Activity className="h-4 w-4 text-slate-400 shrink-0" />,
        label: "Duration",
        render: (med) => (
          <span className="text-[10px] font-mono">
            {format(new Date(med.start_date), "MMM d")} —{" "}
            {med.end_date ? format(new Date(med.end_date), "MMM d") : "Ongoing"}
          </span>
        ),
        className: "pt-2 border-t justify-end",
      },
    ],

    actions: [
      {
        label: "Copy RxNorm ID (RXCUI)",
        onClick: (med) => {
          if (med.rxcui) {
            navigator.clipboard.writeText(med.rxcui);
            toast.success("RXCUI copied to clipboard");
          }
        },
        icon: <Clipboard className="mr-2 h-4 w-4" />,
      },
      {
        label: "View FDA Insights",
        onClick: (med) => {
          console.log("Open full details for:", med.drug_name);
          // openView(med);
        },
        icon: <Info className="mr-2 h-4 w-4" />,
        separator: true,
      },
      {
        label: (med: any) =>
          med.is_enabled ? "Pause Reminder" : ("Resume Reminder" as any),
        onClick: (med) => {
          console.log("Toggle enabled status for:", med.id);
        },
        icon: <Power className="mr-2 h-4 w-4" />,
      },
      {
        label: "Delete Reminder",
        onClick: (med) => {
          console.log("Delete med reminder:", med.id);
        },
        icon: <Trash2 className="mr-2 h-4 w-4" />,
        destructive: true,
      },
    ],

    getId: (med) => med.id,
  };

  return config;
};
