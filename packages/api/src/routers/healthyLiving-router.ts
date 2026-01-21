// import { healthyLivingSchema } from "@4ol/db/schemas/healthyLiving.schema";
// import { protectedProcedure, router } from "../trpc";
// import { TRPCError } from "@trpc/server";
// import { db, dbTransact } from "@4ol/db";
// import {
//   healthyLiving,
//   healthyLivingTypes,
// } from "@4ol/db/models/healthyLiving.model";
// import slugify from "slugify";
// import { eq, sql } from "drizzle-orm";
// import z from "zod";

// export const healthyLivingRouter = router({
//   createHealthyLiving: protectedProcedure
//     .input(healthyLivingSchema.extend({ slug: z.string() }))
//     .mutation(async ({ input }) => {
//       try {
//         await dbTransact.transaction(async (tx) => {
//           const [result] = await tx
//             .insert(healthyLiving)
//             .values({
//               name: input.name,
//               slug: input.slug,
//               about: input.about,
//               category: input.category,
//               imageUrl: input.image_url,
//               contactYourDoctor: input.contact_your_doctor,
//               moreInformation: input.more_information,
//               attribution: input.attribution,
//             })
//             .returning({ id: healthyLiving.id });

//           const healthyLivingId = result.id;

//           await tx.insert(healthyLivingTypes).values(
//             input.types.map((type) => ({
//               healthyLivingId: healthyLivingId,
//               ...type,
//             }))
//           );

//           return { success: true, id: healthyLivingId };
//         });
//       } catch (error) {
//         console.error("Error: ", error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Database error while saving healthyLiving.",
//           cause: error,
//         });
//       }
//     }),

//   getAll: protectedProcedure
//     .input(z.object({ page: z.number(), limit: z.number() }))
//     .query(async ({ input }) => {
//       const { page, limit } = input;
//       const offset = (page - 1) * limit;

//       const [healthyLivings, [{ count }]] = await Promise.all([
//         db
//           .select({
//             id: healthyLiving.id,
//             name: healthyLiving.name,
//             about: healthyLiving.about,
//             category: healthyLiving.category,
//             imageUrl: healthyLiving.imageUrl,
//             contactYourDoctor: healthyLiving.contactYourDoctor,
//             moreInformation: healthyLiving.moreInformation,
//             attribution: healthyLiving.attribution,
//           })
//           .from(healthyLiving)
//           .limit(limit)
//           .offset(offset),

//         db.select({ count: sql<number>`count(*)` }).from(healthyLiving),
//       ]);
//       return {
//         healthyLivings,
//         meta: {
//           totalPages: Math.ceil(count / limit),
//           total: count,
//           currentPage: page,
//         },
//       };
//     }),

//   updateHealthyLiving: protectedProcedure
//     .input(healthyLivingSchema.extend({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       try {
//         await dbTransact.transaction(async (tx) => {
//           const [result] = await tx
//             .update(healthyLiving)
//             .set({
//               name: input.name,
//               about: input.about,
//               category: input.category,
//               imageUrl: input.image_url,
//               contactYourDoctor: input.contact_your_doctor,
//               moreInformation: input.more_information,
//               attribution: input.attribution,
//             })
//             .where(eq(healthyLiving.id, input.id))
//             .returning({ id: healthyLiving.id });

//           const healthyLivingId = result.id;

//           await tx
//             .delete(healthyLivingTypes)
//             .where(eq(healthyLivingTypes.healthyLivingId, healthyLivingId));

//           tx.insert(healthyLivingTypes).values(
//             input.types.map((type) => ({
//               healthyLivingId: healthyLivingId,
//               ...type,
//             }))
//           );

//           return { success: true, id: healthyLivingId };
//         });
//       } catch (error) {
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Database error while saving healthyLiving.",
//           cause: error,
//         });
//       }
//     }),

//   deleteHealthyLiving: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       try {
//         await dbTransact.transaction(async (tx) => {
//           await tx.delete(healthyLiving).where(eq(healthyLiving.id, input.id));
//         });
//       } catch (error) {
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Database error while deleting healthyLiving.",
//           cause: error,
//         });
//       }
//     }),
// });
