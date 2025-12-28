import {
  customType,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // e.g., "Infectious Diseases"
  slug: text("slug").notNull().unique(),
});

// 2. Body Parts Table (e.g., Heart, Lungs, Skin)
export const bodyParts = pgTable("body_parts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const conditions = pgTable(
  "conditions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),

    // RichText fields
    about: jsonb("about"),
    diagnosis: jsonb("diagnosis"),
    treatment: jsonb("treament"),
    complications: jsonb("complications"),
    symptoms: jsonb("symptoms"),
    prevention: jsonb("prevention"),
    contactYourDoctor: jsonb("contact_your_doctor"),
    moreInformation: jsonb("more_information"),
    attribution: jsonb("attribution"),

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
  (table) => [index("condition_name_ix").on(table.name)]
);

export const conditionTypes = pgTable("condition_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  conditionId: uuid("condition_id").references(() => conditions.id),
  typeName: text("type_name").notNull(),
  aboutType: jsonb("about_type"), // RichText for specific types
});

export const conditionCauses = pgTable("condition_causes", {
  id: uuid("id").primaryKey().defaultRandom(),
  conditionId: uuid("condition_id").references(() => conditions.id),
  causeName: text("cause_name").notNull(),
  otherPossibleCauses: jsonb("other_possible_causes"),
});

// 4. Join Table: Condition <-> BodyPart (Many-to-Many)
export const conditionToBodyParts = pgTable("condition_body_parts", {
  conditionId: uuid("condition_id").references(() => conditions.id),
  bodyPartId: uuid("body_part_id").references(() => bodyParts.id),
});

// 5. Join Table: Condition <-> Category (Many-to-Many)
export const conditionToCategories = pgTable("condition_categories", {
  conditionId: uuid("condition_id").references(() => conditions.id),
  categoryId: uuid("category_id").references(() => categories.id),
});
