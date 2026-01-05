import { db, dbTransact } from "@4ol/db";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  conditionsSchema,
  symptomsSchema,
  TConditionsOutput,
} from "@4ol/db/schemas/conditions.schema";
import {
  bodyParts,
  categories,
  conditionCauses,
  conditions,
  conditionToBodyParts,
  conditionToCategories,
  conditionTypes,
} from "@4ol/db/models/conditions.model";
import z from "zod";
import { aliasedTable, desc, eq, gt, sql } from "drizzle-orm";
import {
  symptomCauses,
  symptoms,
  symptomToBodyParts,
  symptomToCategories,
  symptomTypes,
} from "@4ol/db/models/symptoms.model";

export const symptomsRouter = router({
  getAllBodyParts: protectedProcedure.query(async () => {
    return await db.query.bodyParts.findMany({
      orderBy: (bodyParts, { asc }) => [asc(bodyParts.name)],
    });
  }),

  getAllCategories: protectedProcedure.query(async () => {
    return await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  registerSymptom: protectedProcedure
    .input(symptomsSchema)
    .mutation(async ({ input }) => {
      try {
        return await dbTransact.transaction(async (tx) => {
          // 1. Insert the main condition first to get the ID
          const [newSymptom] = await tx
            .insert(symptoms)
            .values({
              name: input.name,
              slug: input.slug as string,
              nhsLink: input.nhsLink,
              imageUrl: input.imageUrl,
              about: input.about,
              isSystemic: input.isSystemic,
              diagnosis: input.diagnosis,
              treatment: input.treatment,
              complications: input.complications,
              prevention: input.prevention,
              specialist: input.specialistToContact,
              contactYourDoctor: input.contactYourDoctor,
              moreInformation: input.moreInformation,
              attribution: input.attribution,
            })
            .returning({ id: symptoms.id });

          const symptomId = newSymptom.id;

          await Promise.all([
            input.bodyPartIds.length > 0 &&
              tx.insert(symptomToBodyParts).values(
                input.bodyPartIds.map((bodyPartId) => ({
                  symptomId: symptomId,
                  bodyPartId: bodyPartId,
                }))
              ),

            // Insert Categories
            input.categoryIds.length > 0 &&
              tx.insert(symptomToCategories).values(
                input.categoryIds.map((categoryId) => ({
                  symptomId: symptomId,
                  categoryId: categoryId,
                }))
              ),

            input.types.length > 0 &&
              tx.insert(symptomTypes).values(
                input.types.map((type) => ({
                  ...type,
                  symptomId,
                }))
              ),

            input.causes.length > 0 &&
              tx.insert(symptomCauses).values(
                input.causes.map((cause) => ({
                  ...cause,
                  symptomId,
                }))
              ),
          ]);
          return { success: true, symptomId };
        });
      } catch (error: unknown) {
        console.error("Transaction failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Failed to register symptom. The database has been rolled back.",
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const { id } = input;

        const symptom = await db.query.symptoms.findFirst({
          where: (conditions, { eq }) => eq(conditions.id, id),
          with: {
            symptomToBodyParts: true,
            symptomToCategory: true,
            symptomCauses: true,
            symptomTypes: true,
          },
        });

        if (!symptom) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Symptom with ID ${input} not found.`,
          });
        }

        return {
          ...symptom,
          bodyPartIds: symptom.symptomToBodyParts.map((bp) => bp.bodyPartId),
          categoryIds: symptom.symptomToCategory.map((cat) => cat.categoryId),
          // Clean up the raw relations so they don't bloat the payload
          symptomToBodyParts: undefined,
          symptomToCategory: undefined,
        };
      } catch (error) {
        console.error("Error fetching: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error while fetching condition.",
        });
      }
    }),

  getAll: protectedProcedure
    .input(z.object({ page: z.number(), limit: z.number() }))
    .query(async ({ input }) => {
      try {
        const { page, limit } = input;
        const offset = (page - 1) * limit;

        const [fetchSymptoms, [{ count }], mostAffectedPart, [{ countCats }]] =
          await Promise.all([
            db
              .select({
                id: symptoms.id,
                name: symptoms.name,
                slug: symptoms.slug,
                imageUrl: symptoms.imageUrl,
                nhsLink: symptoms.nhsLink,
                isSystemic: symptoms.isSystemic,
                specialist: symptoms.specialist,
              })
              .from(symptoms)
              .limit(limit)
              .offset(offset),

            db.select({ count: sql<number>`count(*)` }).from(symptoms),

            getHierarchicalSymptomStats(),

            db
              .select({ countCats: sql<number>`count(*)` })
              .from(categories)
              .where(eq(categories.level, 0)),
          ]);

        return {
          symptoms: fetchSymptoms,
          analytics: {
            mostAffectedBodyParts: mostAffectedPart.slice(
              0,
              1
            ) as TMostAffectedBosyPart, // Only top 1 for the UI
            totalCategories: countCats,
          },
          meta: {
            totalPages: Math.ceil(count / limit),
            total: count,
            currentPage: page,
          },
        };
      } catch (error) {
        console.log("Error fetching conditions: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error while fetching conditions.",
        });
      }
    }),

  updateSymptom: protectedProcedure
    .input(conditionsSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id, ...conditionsData } = input;

      return await db.transaction(async (tx) => {
        // 1. Update the main record
        const [updatedCondition] = await tx
          .update(conditions)
          .set({
            name: conditionsData.name,
            about: conditionsData.about,
            diagnosis: conditionsData.diagnosis,
            treatment: conditionsData.treatment,
            complications: conditionsData.complications,
            symptoms: conditionsData.symptoms,
            prevention: conditionsData.prevention,
            specialist: conditionsData.specialistToContact,
            contactYourDoctor: conditionsData.contactYourDoctor,
            moreInformation: conditionsData.moreInformation,
            attribution: conditionsData.attribution,
            imageUrl: conditionsData.imageUrl,
            isSystemic: conditionsData.isSystemic,
          })
          .where(eq(conditions.id, id))
          .returning({ id: conditions.id });

        const conditionId = updatedCondition.id;

        // 2. Await Deletes FIRST (Avoid Race Conditions)
        await Promise.all([
          tx
            .delete(conditionToBodyParts)
            .where(eq(conditionToBodyParts.conditionId, conditionId)),
          tx
            .delete(conditionToCategories)
            .where(eq(conditionToCategories.conditionId, conditionId)),
          tx
            .delete(conditionTypes)
            .where(eq(conditionTypes.conditionId, conditionId)),
          tx
            .delete(conditionCauses)
            .where(eq(conditionCauses.conditionId, conditionId)),
        ]);

        // 3. Re-insert only if there is data (Prevents Drizzle/PG empty values error)
        const inserts = [];

        if (conditionsData.bodyPartIds.length > 0) {
          inserts.push(
            tx.insert(conditionToBodyParts).values(
              conditionsData.bodyPartIds.map((bpId) => ({
                conditionId,
                bodyPartId: bpId,
              }))
            )
          );
        }

        if (conditionsData.categoryIds.length > 0) {
          inserts.push(
            tx.insert(conditionToCategories).values(
              conditionsData.categoryIds.map((catId) => ({
                conditionId,
                categoryId: catId,
              }))
            )
          );
        }

        if (conditionsData.types.length > 0) {
          inserts.push(
            tx
              .insert(conditionTypes)
              .values(conditionsData.types.map((t) => ({ ...t, conditionId })))
          );
        }

        if (conditionsData.causes.length > 0) {
          inserts.push(
            tx
              .insert(conditionCauses)
              .values(conditionsData.causes.map((c) => ({ ...c, conditionId })))
          );
        }

        await Promise.all(inserts);

        return { success: true };
      });
    }),

  deleteSymptom: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // With CASCADE, deleting the parent automatically cleans up ALL children
        const [deleted] = await db
          .delete(conditions)
          .where(eq(conditions.id, input.id))
          .returning({ id: conditions.id });

        if (!deleted) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Condition not found",
          });
        }

        return { success: true, id: deleted.id };
      } catch (error) {
        console.error("Delete failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete condition",
        });
      }
    }),
});

//======================== Helpers
type TMostAffectedBosyPart = {
  id: string;
  name: string;
  path: string;
  totalConditions: number;
}[];
export const getHierarchicalSymptomStats = async () => {
  // 1. Create an alias for the 'descendants' instance of the table
  const descendants = aliasedTable(bodyParts, "descendants");

  return await db
    .select({
      id: bodyParts.id,
      name: bodyParts.name,
      path: bodyParts.path,
      // We count conditions linked to the descendants
      totalConditions: sql<number>`
        count(DISTINCT ${symptomToBodyParts.symptomId})
      `.mapWith(Number),
    })
    .from(bodyParts) // This is our 'Parent'
    // 2. Join the 'Parent' to the 'Descendants' using the alias
    .leftJoin(descendants, sql`${bodyParts.path} @> ${descendants.path}`)
    // 3. Connect the conditions to those descendants
    .leftJoin(
      symptomToBodyParts,
      eq(descendants.id, symptomToBodyParts.bodyPartId)
    )
    .where(gt(bodyParts.level, 0))
    .groupBy(bodyParts.id)
    .orderBy(desc(sql`count(DISTINCT ${symptomToBodyParts.symptomId})`));
};
