import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Create a dedicated Categories table
export const faqCategories = pgTable("faq_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // e.g., 'General', 'Services', 'Payments'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Modify your existing FAQs table
export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => faqCategories.id, { onDelete: "cascade" })
    .notNull(), // Links the FAQ to a category
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// 3. Define Relations (Optional but helpful for Drizzle Queries)
export const faqCategoriesRelations = relations(faqCategories, ({ many }) => ({
  faqs: many(faqs),
}));

export const faqsRelations = relations(faqs, ({ one }) => ({
  category: one(faqCategories, {
    fields: [faqs.categoryId],
    references: [faqCategories.id],
  }),
}));
