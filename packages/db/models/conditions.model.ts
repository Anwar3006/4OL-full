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

// Custom type for Postgres ltree
const ltree = customType<{ data: string }>({
  dataType() {
    return "ltree";
  },
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(), // e.g., "Infectious Diseases"
    slug: text("slug").notNull().unique(),
    description: text("description"),

    // Self-Referential Foreign Key
    parentId: uuid("parent_id").references((): any => categories.id, {
      onDelete: "cascade",
    }),
    path: ltree("path").notNull(),
    level: integer("level").default(0),
  },
  (table) => [
    //Gist index for Materialized Path Traversal(Tree Traversal)
    index("category_path_idx").using("gist", table.path),
  ],
);
export const categoriesRelations = relations(categories, ({ many }) => ({
  conditionToCategory: many(conditionToCategories),
}));

// 2. Body Parts Table (e.g., Heart, Lungs, Skin)
export const bodyParts = pgTable(
  "body_parts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),

    // Self-Referential Foreign Key to help with tree structure
    parentId: uuid("parent_id").references((): any => bodyParts.id, {
      onDelete: "cascade",
    }),
    // Mesh ID for React-Native 3D anatomical model tap-to-search
    meshId: text("mesh_id"),
    // Path for Materialized Path Traversal -> /root/organ/heart is stored instead of recomputing the tree path for each query
    path: ltree("path").notNull(),
    // LEVEL: Useful for quick UI filtering (0 = Major Region, 1 = Organ, 2 = Sub-part)
    level: integer("level").default(0),
  },
  (table) => [
    //GIST index is the standard for ltree path traversal
    index("materialized_bodypart_path_idx").using("gist", table.path),
    // Index for meshId lookup (used when tapping the 3D model)
    index("bodypart_mesh_idx").on(table.meshId),
  ],
);
export const bodyPartsRelations = relations(bodyParts, ({ many }) => ({
  conditionToBodyParts: many(conditionToBodyParts),
}));

export const conditions = pgTable(
  "conditions",
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
    symptoms: jsonb("symptoms").$type<SerializedEditorState>(),
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
  (table) => [index("condition_name_idx").on(table.name)],
);
export const conditionsRelations = relations(conditions, ({ many }) => ({
  conditionToCategory: many(conditionToCategories),
  conditionToBodyParts: many(conditionToBodyParts),
  conditionTypes: many(conditionTypes),
  conditionCauses: many(conditionCauses),
}));

export const conditionTypes = pgTable("condition_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  conditionId: uuid("condition_id").references(() => conditions.id, {
    onDelete: "cascade",
  }),
  typeName: text("type_name").notNull(),
  aboutType: jsonb("about_type"), // RichText for specific types
});
export const conditionTypesRelations = relations(conditionTypes, ({ one }) => ({
  condition: one(conditions, {
    fields: [conditionTypes.conditionId],
    references: [conditions.id],
  }),
}));

export const conditionCauses = pgTable("condition_causes", {
  id: uuid("id").primaryKey().defaultRandom(),
  conditionId: uuid("condition_id").references(() => conditions.id, {
    onDelete: "cascade",
  }),
  causeName: text("cause_name").notNull(),
  otherPossibleCauses: jsonb("other_possible_causes"),
});
export const conditionCausesRelations = relations(
  conditionCauses,
  ({ one }) => ({
    condition: one(conditions, {
      fields: [conditionCauses.conditionId],
      references: [conditions.id],
    }),
  }),
);

// 4. Join Table: Condition <-> BodyPart (Many-to-Many)
export const conditionToBodyParts = pgTable(
  "condition_body_parts",
  {
    conditionId: uuid("condition_id").references(() => conditions.id, {
      onDelete: "cascade",
    }),
    bodyPartId: uuid("body_part_id").references(() => bodyParts.id),
  },
  (t) => [
    // Composite index: speeds up finding conditions for a specific part
    primaryKey({ columns: [t.bodyPartId, t.conditionId] }),
    index("condition_lookup_idx").on(t.conditionId),
  ],
);
export const conditionToBodyPartsRelations = relations(
  conditionToBodyParts,
  ({ one }) => ({
    condition: one(conditions, {
      fields: [conditionToBodyParts.conditionId],
      references: [conditions.id],
    }),
  }),
);

// 5. Join Table: Condition <-> Category (Many-to-Many)
export const conditionToCategories = pgTable(
  "condition_categories",
  {
    conditionId: uuid("condition_id").references(() => conditions.id, {
      onDelete: "cascade",
    }),
    categoryId: uuid("category_id").references(() => categories.id),
  },
  (table) => [primaryKey({ columns: [table.categoryId, table.conditionId] })],
);
export const conditionToCategoriesRelations = relations(
  conditionToCategories,
  ({ one }) => ({
    condition: one(conditions, {
      fields: [conditionToCategories.conditionId],
      references: [conditions.id],
    }),
  }),
);
