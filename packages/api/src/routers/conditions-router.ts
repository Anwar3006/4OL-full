// import { db, dbTransact } from "@4ol/db";
// import { protectedProcedure, router } from "../trpc";
// import { TRPCError } from "@trpc/server";
// import {
//   conditionsSchema,
//   TConditionsOutput,
// } from "@4ol/db/schemas/conditions.schema";
// import {
//   bodyParts,
//   categories,
//   conditionCauses,
//   conditions,
//   conditionToBodyParts,
//   conditionToCategories,
//   conditionTypes,
// } from "@4ol/db/models/conditions.model";
// import z from "zod";
// import { aliasedTable, desc, eq, gt, sql } from "drizzle-orm";

// export const conditionsRouter = router({
//   getAllBodyParts: protectedProcedure.query(async () => {
//     return await db.query.bodyParts.findMany({
//       orderBy: (bodyParts, { asc }) => [asc(bodyParts.name)],
//     });
//   }),

//   getAllCategories: protectedProcedure.query(async () => {
//     return await db.query.categories.findMany({
//       orderBy: (categories, { asc }) => [asc(categories.name)],
//     });
//   }),

//   registerCondition: protectedProcedure
//     .input(conditionsSchema)
//     .mutation(async ({ input }) => {
//       try {
//         return await dbTransact.transaction(async (tx) => {
//           // 1. Insert the main condition first to get the ID
//           const [newCondition] = await tx
//             .insert(conditions)
//             .values({
//               name: input.name,
//               slug: input.slug as string,
//               nhsLink: input.nhsLink,
//               imageUrl: input.imageUrl,
//               about: input.about,
//               isSystemic: input.isSystemic,
//               diagnosis: input.diagnosis,
//               treatment: input.treatment,
//               complications: input.complications,
//               symptoms: input.symptoms,
//               prevention: input.prevention,
//               specialist: input.specialistToContact,
//               contactYourDoctor: input.contactYourDoctor,
//               moreInformation: input.moreInformation,
//               attribution: input.attribution,
//             })
//             .returning({ id: conditions.id });

//           const conditionId = newCondition.id;

//           await Promise.all([
//             input.bodyPartIds.length > 0 &&
//               tx.insert(conditionToBodyParts).values(
//                 input.bodyPartIds.map((bodyPartId) => ({
//                   conditionId: conditionId,
//                   bodyPartId: bodyPartId,
//                 }))
//               ),

//             // Insert Categories
//             input.categoryIds.length > 0 &&
//               tx.insert(conditionToCategories).values(
//                 input.categoryIds.map((categoryId) => ({
//                   conditionId: conditionId,
//                   categoryId: categoryId,
//                 }))
//               ),

//             input.types.length > 0 &&
//               tx.insert(conditionTypes).values(
//                 input.types.map((type) => ({
//                   ...type,
//                   conditionId,
//                 }))
//               ),

//             input.causes.length > 0 &&
//               tx.insert(conditionCauses).values(
//                 input.causes.map((cause) => ({
//                   ...cause,
//                   conditionId,
//                 }))
//               ),
//           ]);
//           return { success: true, conditionId };
//         });
//       } catch (error: unknown) {
//         console.error("Transaction failed:", error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message:
//             "Failed to register condition. The database has been rolled back.",
//         });
//       }
//     }),

//   getById: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .query(async ({ input }) => {
//       try {
//         const { id } = input;

//         const condition = await db.query.conditions.findFirst({
//           where: (conditions, { eq }) => eq(conditions.id, id),
//           with: {
//             conditionToBodyParts: true,
//             conditionToCategory: true,
//             conditionTypes: true,
//             conditionCauses: true,
//           },
//         });

//         if (!condition) {
//           throw new TRPCError({
//             code: "NOT_FOUND",
//             message: `Condition with ID ${input} not found.`,
//           });
//         }

//         return {
//           ...condition,
//           bodyPartIds: condition.conditionToBodyParts.map(
//             (bp) => bp.bodyPartId
//           ),
//           categoryIds: condition.conditionToCategory.map(
//             (cat) => cat.categoryId
//           ),
//           // Clean up the raw relations so they don't bloat the payload
//           conditionToBodyParts: undefined,
//           conditionToCategory: undefined,
//         };
//       } catch (error) {
//         console.error("Error fetching: ", error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Database error while fetching condition.",
//         });
//       }
//     }),

//   getAll: protectedProcedure
//     .input(z.object({ page: z.number(), limit: z.number() }))
//     .query(async ({ input }) => {
//       try {
//         const { page, limit } = input;
//         const offset = (page - 1) * limit;

//         const [fetchConditons, [{ count }], mostAffectedPart, [{ countCats }]] =
//           await Promise.all([
//             db
//               .select({
//                 id: conditions.id,
//                 name: conditions.name,
//                 slug: conditions.slug,
//                 imageUrl: conditions.imageUrl,
//                 nhsLink: conditions.nhsLink,
//                 isSystemic: conditions.isSystemic,
//                 specialist: conditions.specialist,
//               })
//               .from(conditions)
//               .limit(limit)
//               .offset(offset),

//             db.select({ count: sql<number>`count(*)` }).from(conditions),

//             getHierarchicalConditionStats(),

//             db
//               .select({ countCats: sql<number>`count(*)` })
//               .from(categories)
//               .where(eq(categories.level, 0)),
//           ]);

//         return {
//           conditions: fetchConditons,
//           analytics: {
//             mostAffectedBodyParts: mostAffectedPart.slice(
//               0,
//               1
//             ) as TMostAffectedBosyPart, // Only top 1 for the UI
//             totalCategories: countCats,
//           },
//           meta: {
//             totalPages: Math.ceil(count / limit),
//             total: count,
//             currentPage: page,
//           },
//         };
//       } catch (error) {
//         console.log("Error fetching conditions: ", error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Database error while fetching conditions.",
//         });
//       }
//     }),

//   updateCondition: protectedProcedure
//     .input(conditionsSchema.extend({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       const { id, ...conditionsData } = input;

//       return await db.transaction(async (tx) => {
//         // 1. Update the main record
//         const [updatedCondition] = await tx
//           .update(conditions)
//           .set({
//             name: conditionsData.name,
//             about: conditionsData.about,
//             diagnosis: conditionsData.diagnosis,
//             treatment: conditionsData.treatment,
//             complications: conditionsData.complications,
//             symptoms: conditionsData.symptoms,
//             prevention: conditionsData.prevention,
//             specialist: conditionsData.specialistToContact,
//             contactYourDoctor: conditionsData.contactYourDoctor,
//             moreInformation: conditionsData.moreInformation,
//             attribution: conditionsData.attribution,
//             imageUrl: conditionsData.imageUrl,
//             isSystemic: conditionsData.isSystemic,
//           })
//           .where(eq(conditions.id, id))
//           .returning({ id: conditions.id });

//         const conditionId = updatedCondition.id;

//         // 2. Await Deletes FIRST (Avoid Race Conditions)
//         await Promise.all([
//           tx
//             .delete(conditionToBodyParts)
//             .where(eq(conditionToBodyParts.conditionId, conditionId)),
//           tx
//             .delete(conditionToCategories)
//             .where(eq(conditionToCategories.conditionId, conditionId)),
//           tx
//             .delete(conditionTypes)
//             .where(eq(conditionTypes.conditionId, conditionId)),
//           tx
//             .delete(conditionCauses)
//             .where(eq(conditionCauses.conditionId, conditionId)),
//         ]);

//         // 3. Re-insert only if there is data (Prevents Drizzle/PG empty values error)
//         const inserts = [];

//         if (conditionsData.bodyPartIds.length > 0) {
//           inserts.push(
//             tx.insert(conditionToBodyParts).values(
//               conditionsData.bodyPartIds.map((bpId) => ({
//                 conditionId,
//                 bodyPartId: bpId,
//               }))
//             )
//           );
//         }

//         if (conditionsData.categoryIds.length > 0) {
//           inserts.push(
//             tx.insert(conditionToCategories).values(
//               conditionsData.categoryIds.map((catId) => ({
//                 conditionId,
//                 categoryId: catId,
//               }))
//             )
//           );
//         }

//         if (conditionsData.types.length > 0) {
//           inserts.push(
//             tx
//               .insert(conditionTypes)
//               .values(conditionsData.types.map((t) => ({ ...t, conditionId })))
//           );
//         }

//         if (conditionsData.causes.length > 0) {
//           inserts.push(
//             tx
//               .insert(conditionCauses)
//               .values(conditionsData.causes.map((c) => ({ ...c, conditionId })))
//           );
//         }

//         await Promise.all(inserts);

//         return { success: true };
//       });
//     }),

//   deleteCondition: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       try {
//         // With CASCADE, deleting the parent automatically cleans up ALL children
//         const [deleted] = await db
//           .delete(conditions)
//           .where(eq(conditions.id, input.id))
//           .returning({ id: conditions.id });

//         if (!deleted) {
//           throw new TRPCError({
//             code: "NOT_FOUND",
//             message: "Condition not found",
//           });
//         }

//         return { success: true, id: deleted.id };
//       } catch (error) {
//         console.error("Delete failed:", error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to delete condition",
//         });
//       }
//     }),
// });

// //======================== Helpers
// type TMostAffectedBosyPart = {
//   id: string;
//   name: string;
//   path: string;
//   totalConditions: number;
// }[];
// export const getHierarchicalConditionStats = async () => {
//   // 1. Create an alias for the 'descendants' instance of the table
//   const descendants = aliasedTable(bodyParts, "descendants");

//   return await db
//     .select({
//       id: bodyParts.id,
//       name: bodyParts.name,
//       path: bodyParts.path,
//       // We count conditions linked to the descendants
//       totalConditions: sql<number>`
//         count(DISTINCT ${conditionToBodyParts.conditionId})
//       `.mapWith(Number),
//     })
//     .from(bodyParts) // This is our 'Parent'
//     // 2. Join the 'Parent' to the 'Descendants' using the alias
//     .leftJoin(descendants, sql`${bodyParts.path} @> ${descendants.path}`)
//     // 3. Connect the conditions to those descendants
//     .leftJoin(
//       conditionToBodyParts,
//       eq(descendants.id, conditionToBodyParts.bodyPartId)
//     )
//     .where(gt(bodyParts.level, 0))
//     .groupBy(bodyParts.id)
//     .orderBy(desc(sql`count(DISTINCT ${conditionToBodyParts.conditionId})`));
// };
