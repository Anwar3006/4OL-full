import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import {
  FACILITY_STATUS_ENUM,
  FACILITY_TYPE_ENUM,
  GHANA_REGIONS_ENUM,
} from "../types/formInput";

export const facilityStatusEnum = pgEnum(
  "facility_status_enum",
  FACILITY_STATUS_ENUM
);
export const regionEnum = pgEnum("region_enum", GHANA_REGIONS_ENUM);
export const facilityTypeEnum = pgEnum(
  "facility_type_enum",
  FACILITY_TYPE_ENUM
);

export const facilityProfile = pgTable(
  "facility_profile",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid(10)),
    facilityType: text("facility_type").notNull(),
    facilityName: text("facility_name").notNull(),
    contactNumber: text("contact_number").notNull(),
    whatsappNumber: text("whatsapp_number").notNull(),
    email: text("email").notNull().unique(),
    mediaUrls: jsonb("media_urls"),

    gps_address: text("gps_address").notNull(),
    street: text("street").notNull(),
    post_code: text("post_code").notNull(),
    area: text("area").notNull(),
    district: text("district").notNull(),
    region: regionEnum("region").notNull().default("greater accra"),
    country: text("country").notNull().default("Ghana"),

    hospital_services: jsonb("hospital_services").$type<string[]>(), // Use string array type,
    hospital_amenities: jsonb("hospital_amenities"),

    // Owner/manager details
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    person_contact_number: text("person_contact_number").notNull(),
    position: text("position").notNull(),

    // Approved, Pending, Rejected
    status: facilityStatusEnum("status").default("pending").notNull(),

    business_hours: jsonb("business_hours"),

    keywords: jsonb("keywords").$type<string[]>(), // Use string array type,
    avg_rating: integer("avg_rating").default(0),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    approvedAt: timestamp("approved_at"),
  },
  (table) => ({
    keywordsGin: index("keywords_gin_idx").using("gin", table.keywords),
  })
);
