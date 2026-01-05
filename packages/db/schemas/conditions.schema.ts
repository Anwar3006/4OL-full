import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { conditions } from "../models/conditions.model";
import { SerializedEditorState } from "lexical";

// Helper for Lexical Rich Text fields
const richTextSchema = z.any(); // Validates the JSONB structure from Lexical

export const conditionsSchema = z.object({
  name: z.string().min(3, "Please enter a name for the condition"),
  slug: z.string().optional(),
  specialistToContact: z.string().optional(),
  nhsLink: z.string(),
  imageUrl: z.string(),
  isSystemic: z.boolean().default(false),

  // 2. Rich Text Fields (JSONB)
  about: richTextSchema,
  diagnosis: richTextSchema,
  treatment: richTextSchema,
  complications: richTextSchema,
  symptoms: richTextSchema,
  prevention: richTextSchema,
  contactYourDoctor: richTextSchema,
  moreInformation: richTextSchema,
  attribution: richTextSchema,

  // 3. Relational Links (Many-to-Many)
  // We expect an array of IDs from the Multi-Select UI
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  bodyPartIds: z.array(z.string()).min(1, "Select at least one body part"),

  // 4. Nested Entities (One-to-Many)
  types: z
    .array(
      z.object({
        typeName: z.string().min(1, "Type name is required"),
        aboutType: richTextSchema,
      })
    )
    .default([]),

  causes: z
    .array(
      z.object({
        causeName: z.string().min(1, "Cause name is required"),
        otherPossibleCauses: richTextSchema,
      })
    )
    .default([]),
});

export type TConditionsInput = z.infer<typeof conditionsSchema>;

export const symptomsSchema = conditionsSchema.omit({ symptoms: true });
export type TSymptomsInput = z.infer<typeof symptomsSchema>;

export type TConditionsOutput = {
  id: string;
  name: string;
  slug: string;
  nhsLink: string | null;
  imageUrl: string | null;
  // Map these to the actual Lexical type
  about: SerializedEditorState;
  diagnosis: SerializedEditorState;
  treatment: SerializedEditorState;
  complications: SerializedEditorState;
  symptoms: SerializedEditorState;
  prevention: SerializedEditorState;
  contactYourDoctor: SerializedEditorState;
  moreInformation: SerializedEditorState;
  attribution: SerializedEditorState;
  isSystemic: boolean;
  specialist: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type TSymptomsOutput = {
  id: string;
  name: string;
  slug: string;
  nhsLink: string | null;
  imageUrl: string | null;
  about: SerializedEditorState;
  diagnosis: SerializedEditorState;
  treatment: SerializedEditorState;
  complications: SerializedEditorState;
  prevention: SerializedEditorState;
  contactYourDoctor: SerializedEditorState;
  moreInformation: SerializedEditorState;
  attribution: SerializedEditorState;
  isSystemic: boolean;
  specialist: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
