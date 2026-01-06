import z from "zod";

const richTextSchema = z.any();

export const healthyLivingSchema = z.object({
  name: z.string().min(3, "Please enter a name"),
  about: richTextSchema,
  types: z.array(
    z.object({
      typeName: z.string(),
      aboutType: richTextSchema,
    })
  ),
  category: richTextSchema,
  contactYourDoctor: richTextSchema,
  moreInformation: richTextSchema,
  attribution: richTextSchema,
  imageUrl: z.string(),
});

export type THealthyLivingInput = z.infer<typeof healthyLivingSchema>;

const healthyLivingSchemaOutput = healthyLivingSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  slug: z.string(),
});
export type THealthyLivingOutput = z.infer<typeof healthyLivingSchemaOutput>;
