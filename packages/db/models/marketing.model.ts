import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { MARKETING_STATUS_ENUM, MARKETING_TYPE_ENUM } from "../types/formInput";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export const marketingTypeEnum = pgEnum(
  "marketing_type_enum",
  MARKETING_TYPE_ENUM
);
export const marketingStatusEnum = pgEnum(
  "marketing_status_enum",
  MARKETING_STATUS_ENUM
);

export const marketingProfile = pgTable("marketing_profile", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid(6)),
  marketingType: marketingTypeEnum().notNull(),
  status: marketingStatusEnum("status").default("draft").notNull(),
  headline: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  cta: text().notNull(),
  links: jsonb("links").default([]),
  organization: text().notNull(),
  startDate: text()
    .notNull()
    .$default(() => "1990-01-01"),
  endDate: text()
    .notNull()
    .$default(() => "1990-01-01"),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
