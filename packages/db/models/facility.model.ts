import {
  boolean,
  doublePrecision,
  geometry,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  FACILITY_STATUS_ENUM,
  FACILITY_TYPE_ENUM,
  GHANA_REGIONS_ENUM,
} from "../types/formInput";
import { relations } from "drizzle-orm";
import { user_profiles } from "./auth.model";

export const facilityStatusEnum = pgEnum(
  "facility_status_enum",
  FACILITY_STATUS_ENUM,
);
export const regionEnum = pgEnum("region_enum", GHANA_REGIONS_ENUM);
export const facilityTypeEnum = pgEnum(
  "facility_type_enum",
  FACILITY_TYPE_ENUM,
);

export const facilityProfile = pgTable(
  "facility_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user_profiles.userId, { onDelete: "cascade" }),
    facilityType: text("facility_type").notNull(),
    facilityName: text("facility_name").notNull(),
    contactNumber: text("contact_number").notNull(),
    whatsappNumber: text("whatsapp_number").notNull(),
    email: text("email").unique(),
    mediaUrls: jsonb("media_urls"),
    featured_image_url: text("featured_image_url").notNull(),

    gpsAddress: text("gps_address").notNull(),
    street: text("street").notNull(),
    postCode: text("post_code").notNull(),
    area: text("area").notNull(),
    district: text("district").notNull(),
    region: regionEnum("region").notNull().default("greater accra"),
    country: text("country").notNull().default("Ghana"),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),

    // Add this column for radius search
    location: geometry("location", {
      type: "point",
      srid: 4326,
    }),

    ownership: text("ownership").notNull(),
    acceptsNhis: boolean("accepts_nhis").default(false),

    services: jsonb("hospital_services").$type<string[]>(), // Use string array type,
    amenities: jsonb("hospital_amenities"),

    // Owner/manager details
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    ownerEmail: text("owner_email").notNull(),
    personContactNumber: text("person_contact_number").notNull(),
    position: text("position").notNull(),

    // Approved, Pending, Rejected
    status: facilityStatusEnum("status").default("pending").notNull(),

    businessHours: jsonb("business_hours"),

    keywords: jsonb("keywords").$type<string[]>(), // Use string array type,
    avgRating: integer("avg_rating").default(0),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    approvedAt: timestamp("approved_at"),
  },
  (table) => [
    // 1. GIN index for fast "contains" search in JSONB
    index("keywords_gin_idx").using("gin", table.keywords),
    index("services_gin_idx").using("gin", table.services),

    // 2. B-Tree index for sorting by rating and filtering by region
    index("region_idx").on(table.region),
    index("rating_idx").on(table.avgRating),

    // 3. Name search (standard B-Tree for "Starts With" or exact)
    index("name_idx").on(table.facilityName),
    index("owner_id_idx").on(table.ownerId),

    // 4. Spatial Index (GIST) - ESSENTIAL for radius performance
    index("location_gist_idx").using("gist", table.location),

    //5. TODO: Implement full-text search for district, area, region, facility_name, keywords so users can search "canc" and get hits like "Cancer"
  ],
);

export const facilityProfileRelations = relations(
  facilityProfile,
  ({ one }) => ({
    owner: one(user_profiles, {
      fields: [facilityProfile.ownerId],
      references: [user_profiles.userId],
    }),
  }),
);
