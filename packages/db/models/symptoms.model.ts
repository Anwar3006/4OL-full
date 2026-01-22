import { relations } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { SerializedEditorState } from "lexical";
import { bodyParts, categories } from "./conditions.model";

// Custom type for Postgres ltree
const ltree = customType<{ data: string }>({
  dataType() {
    return "ltree";
  },
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  symptomToCategory: many(symptomToCategories),
}));

export const bodyPartsRelations = relations(bodyParts, ({ many }) => ({
  symptomToBodyParts: many(symptomToBodyParts),
}));

export const symptoms = pgTable(
  "symptoms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    nhsLink: text("nhs_link").notNull(),
    imageUrl: text("image_url"),

    // RichText fields
    about: jsonb("about").$type<SerializedEditorState>(),
    diagnosis: jsonb("diagnosis").$type<SerializedEditorState>(),
    treatment: jsonb("treatment").$type<SerializedEditorState>(),
    complications: jsonb("complications").$type<SerializedEditorState>(),
    prevention: jsonb("prevention").$type<SerializedEditorState>(),
    contactYourDoctor: jsonb(
      "contact_your_doctor",
    ).$type<SerializedEditorState>(),
    moreInformation: jsonb("more_information").$type<SerializedEditorState>(),
    attribution: jsonb("attribution").$type<SerializedEditorState>(),

    isSystemic: boolean("is_systemic").notNull().default(false),

    //TSvector for full text search
    searchVector: customType<{ data: string }>({
      dataType() {
        return "tsvector";
      },
    })("search_vector"),

    specialist: text("specialist"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("symptom_name_idx").on(table.name)],
);
export const symptomRelations = relations(symptoms, ({ many }) => ({
  symptomToCategory: many(symptomToCategories),
  symptomToBodyParts: many(symptomToBodyParts),
  symptomTypes: many(symptomTypes),
  symptomCauses: many(symptomCauses),
}));

export const symptomTypes = pgTable("symptom_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  symptomId: uuid("symptom_id").references(() => symptoms.id, {
    onDelete: "cascade",
  }),
  typeName: text("type_name").notNull(),
  aboutType: jsonb("about_type"), // RichText for specific types
});
export const symptomTypesRelations = relations(symptomTypes, ({ one }) => ({
  symptom: one(symptoms, {
    fields: [symptomTypes.id],
    references: [symptoms.id],
  }),
}));

export const symptomCauses = pgTable("symptom_causes", {
  id: uuid("id").primaryKey().defaultRandom(),
  symptomId: uuid("symptom_id").references(() => symptoms.id, {
    onDelete: "cascade",
  }),
  causeName: text("cause_name").notNull(),
  otherPossibleCauses: jsonb("other_possible_causes"),
});
export const symptomCausesRelations = relations(symptomCauses, ({ one }) => ({
  symptom: one(symptoms, {
    fields: [symptomCauses.symptomId],
    references: [symptoms.id],
  }),
}));

// 4. Join Table: Symptom <-> BodyPart (Many-to-Many)
export const symptomToBodyParts = pgTable(
  "symptom_body_parts",
  {
    symptomId: uuid("symptom_id").references(() => symptoms.id, {
      onDelete: "cascade",
    }),
    bodyPartId: uuid("body_part_id").references(() => bodyParts.id),
  },
  (t) => [
    // Composite index: speeds up finding symptoms for a specific part
    primaryKey({ columns: [t.bodyPartId, t.symptomId] }),
    index("symptom_lookup_idx").on(t.symptomId),
  ],
);
export const symptomToBodyPartsRelations = relations(
  symptomToBodyParts,
  ({ one }) => ({
    symptom: one(symptoms, {
      fields: [symptomToBodyParts.symptomId],
      references: [symptoms.id],
    }),
  }),
);

// 5. Join Table: Symptom <-> Category (Many-to-Many)
export const symptomToCategories = pgTable(
  "symptom_categories",
  {
    symptomId: uuid("symptom_id").references(() => symptoms.id, {
      onDelete: "cascade",
    }),
    categoryId: uuid("category_id").references(() => categories.id),
  },
  (table) => [primaryKey({ columns: [table.categoryId, table.symptomId] })],
);
export const symptomToCategoriesRelations = relations(
  symptomToCategories,
  ({ one }) => ({
    symptom: one(symptoms, {
      fields: [symptomToCategories.symptomId],
      references: [symptoms.id],
    }),
  }),
);
