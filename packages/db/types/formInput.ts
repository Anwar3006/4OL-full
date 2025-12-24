// Define the sex options
export const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
// For database enum
export const SEX_ENUM = ["male", "female", "other"] as const;

export const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "registrar", label: "Registrar" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];
export const ROLE_ENUM = ["user", "registrar", "admin", "super_admin"] as const;

export const USER_TYPE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "business_provider", label: "Business Provider" },
  { value: "both", label: "Both" },
];
export const USER_TYPE_ENUM = [
  "customer",
  "business_provider",
  "both",
] as const;

export const STATUS_OPTIONS = [];
export const STATUS_ENUM = [
  "active",
  "pending",
  "inactive",
  "suspended",
] as const;

export const FACILITY_STATUS_ENUM = [
  "pending",
  "active",
  "rejected",
  "suspended",
] as const;
export const FACILITY_TYPE_ENUM = [
  "hospitals_&_clinics",
  "herbal_centers",
  "diagnostic_labs",
  "pharmacies",
  "dental_clinics",
  "homes",
  "eye_clinics",
  "osteopathy_centers",
  "physiotherapy_centers",
  "prosthetics_centers",
  "psychiatric_centers",
  "ibps",
] as const;

export const GHANA_REGIONS_ENUM = [
  "ahafo",
  "ashanti",
  "bono",
  "bono east",
  "central",
  "eastern",
  "greater accra",
  "north east",
  "northern",
  "oti",
  "savannah",
  "upper east",
  "upper west",
  "volta",
  "western",
  "western north",
] as const;
// the relationsship between role and user type for permissions
// Super Admin -> both
// Admin -> both but with only ability to view not edit/delete
// Registrar -> customer
// USer -> customer
