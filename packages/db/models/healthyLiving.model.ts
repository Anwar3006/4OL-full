import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { SerializedEditorState } from "lexical";

export const healthyLiving = pgTable("healthy_living", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  about: jsonb("about").$type<SerializedEditorState>(),
  category: jsonb("category").$type<SerializedEditorState>(),
  contactYourDoctor: jsonb(
    "contact_your_doctor"
  ).$type<SerializedEditorState>(),
  moreInformation: jsonb("more_information").$type<SerializedEditorState>(),
  attribution: jsonb("attribution").$type<SerializedEditorState>(),
  imageUrl: text("image_url"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const healthyLivingTypes = pgTable("healthy_living_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  healthyLivingId: uuid("healthy_living_id").references(
    () => healthyLiving.id,
    {
      onDelete: "cascade",
    }
  ),
  type_name: text("type_name").notNull(),
  about_type: jsonb("about_type"),
});

export const healthyLivingRelations = relations(healthyLiving, ({ many }) => ({
  healthyLivingTypes: many(healthyLivingTypes),
}));

export const healthyLivingTypesRelations = relations(
  healthyLivingTypes,
  ({ one }) => ({
    healthyLiving: one(healthyLiving, {
      fields: [healthyLivingTypes.healthyLivingId],
      references: [healthyLiving.id],
    }),
  })
);
