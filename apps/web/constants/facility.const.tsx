import { TFacilityProfileOutput } from "@4ol/db/schemas/facility-profile.schema";
import { JSX } from "react";

// export const FacilityTabs: TFacilityTabs = [
//   {
//     value: "hospitals_&_clinics",
//     label: "Hospitals/Clinics",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "herbal_centers",
//     label: "Herbal Centers",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "diagnostic_labs",
//     label: "Diagnostic Labs",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "pharmacies",
//     label: "Pharmacies",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "dental_clinics",
//     label: "Dental Clinics",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "homes",
//     label: "Homes",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "eye_clinics",
//     label: "Eye Clinics",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "osteopathy_centers",
//     label: "Osteopathy Centers",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "physiotherapy_centers",
//     label: "Physiotherapy Centers",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "prosthetics_centers",
//     label: "Prosthetics Centers",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "psychiatric_centers",
//     label: "Psychiatric Centers",
//     content: <HospitalTabContent />,
//   },
//   {
//     value: "ibps",
//     label: "IBPs",
//     content: <HospitalTabContent />,
//   },
// ];

export const StatusMap: Record<TFacilityProfileOutput["status"], JSX.Element> =
  {
    pending: (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Pending
      </span>
    ),
    active: (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        Active
      </span>
    ),

    inactive: (
      <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
        Inactive
      </span>
    ),
    rejected: (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        Rejected
      </span>
    ),
  };
