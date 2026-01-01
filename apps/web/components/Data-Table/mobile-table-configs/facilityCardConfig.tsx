"use client";

import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { MobileCardConfig } from "../mobile-card-types";
import { StatusMap } from "@/constants/facility.const";
import { TFacilityTable } from "@4ol/db/schemas/facility-profile.schema";

/**
 * Mobile card configuration for Facility entities
 * This defines how facility data should be displayed in card format on mobile devices
 */
export const facilityCardConfig: MobileCardConfig<TFacilityTable> = {
  // Header configuration
  header: {
    title: (facility) => facility.facilityName,
    subtitle: (facility) => facility.facilityType,
    badge: (facility) => StatusMap[facility.status],
  },

  // Fields to display in card body
  fields: [
    {
      id: "email",
      icon: <Mail className="h-4 w-4 shrink-0" />,
      render: (facility) => <span className="truncate">{facility.email}</span>,
    },
    {
      id: "phone",
      icon: <Phone className="h-4 w-4 shrink-0" />,
      render: (facility) => <span>{facility.contactNumber}</span>,
    },
    {
      id: "region",
      icon: <MapPin className="h-4 w-4 shrink-0" />,
      label: "Region",
      render: (facility) => (
        <span className="text-xs font-medium">{facility.region}</span>
      ),
      className: "pt-2 border-t justify-between",
    },
  ],

  // Action menu items
  actions: [
    {
      label: "Copy Facility ID",
      onClick: (facility) => {
        navigator.clipboard.writeText(facility.id);
      },
      separator: true,
    },
    {
      label: "View Details",
      onClick: (facility) => {
        console.log("View details for:", facility.id);
      },
    },
    {
      label: "Edit Facility",
      onClick: (facility) => {
        console.log("Edit facility:", facility.id);
      },
      separator: true,
    },
    {
      label: "Deactivate",
      onClick: (facility) => {
        console.log("Deactivate facility:", facility.id);
      },
      destructive: true,
    },
  ],

  getId: (facility) => facility.id,
};
