// Define apis for the facility profiles

// import {
//   facilityProfileSchema,
//   TFacilityTable,
// } from "@4ol/db/schemas/facility-profile.schema";
// import { protectedProcedure, router } from "../trpc";
// import { db, dbTransact } from "@4ol/db";
// import { user, user_profiles } from "@4ol/db/models/auth.model";
// import { auth } from "../auth";
// import { TRPCError } from "@trpc/server";
// import { facilityProfile } from "@4ol/db/models/facility.model";
// import { and, desc, eq, ilike, like, or, sql } from "drizzle-orm";
// import { queryPaginationSchema } from "@4ol/db/schemas/pagination.schema";
// import z from "zod";
// import { s3Client } from "../s3Client";
// import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// export const facilityProfileRouter = router({

//   getFacilities: protectedProcedure
//     .input(
//       queryPaginationSchema.extend({
//         includeStatsOnly: z.boolean().default(false), // Toggle for Overview page
//       })
//     )
//     .query(async ({ input }) => {
//       const { limit, page, search, status, type, includeStatsOnly } = input;
//       const offset = (page - 1) * limit;

//       // 1. Build the dynamic WHERE clause for shared filtering
//       const filters = [];
//       if (status) filters.push(eq(facilityProfile.status, status));
//       if (type) filters.push(eq(facilityProfile.facilityType, type));
//       if (search) {
//         filters.push(
//           or(
//             ilike(facilityProfile.facilityName, `%${search}%`),
//             ilike(facilityProfile.district, `%${search}%`),
//             ilike(facilityProfile.region, `%${search}%`)
//           )
//         );
//       }

//       const whereClause = filters.length > 0 ? and(...filters) : undefined;

//       // 2. Parallel Database Execution
//       const [facilities, countRes, stats] = await Promise.all([
//         // Only fetch list if NOT in "Stats Only" mode
//         !includeStatsOnly
//           ? db
//               .select()
//               .from(facilityProfile)
//               .where(whereClause)
//               .limit(limit)
//               .offset(offset)
//           : Promise.resolve([]),

//         db
//           .select({ count: sql<number>`count(*)` })
//           .from(facilityProfile)
//           .where(whereClause),

//         // Fetch stats based on the same filters (Context-Aware Stats)
//         db
//           .select({
//             status: facilityProfile.status,
//             count: sql<number>`count(*)`,
//           })
//           .from(facilityProfile)
//           .where(whereClause) // This makes stats update as you search
//           .groupBy(facilityProfile.status),
//       ]);

//       const totalCount = Number(countRes[0]?.count ?? 0);

//       return {
//         facilities: facilities as TFacilityTable[],
//         meta: {
//           total: totalCount,
//           totalPages: Math.ceil(totalCount / limit),
//           currentPage: page,
//         },
//         stats: {
//           active: stats.find((s) => s.status === "active")?.count || 0,
//           inactive: stats.find((s) => s.status === "inactive")?.count || 0,
//           pending: stats.find((s) => s.status === "pending")?.count || 0,
//           rejected: stats.find((s) => s.status === "rejected")?.count || 0,
//           totalInContext: stats.reduce((acc, s) => acc + Number(s.count), 0),
//         },
//       };
//     }),

//   getById: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .query(async ({ input }) => {
//       const { id } = input;
//       const facility = await db.query.facilityProfile.findFirst({
//         where: eq(facilityProfile.id, id),
//         with: {
//           owner: true,
//         },
//       });
//       if (!facility) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Facility not found",
//         });
//       }
//       return {
//         ...facility,
//         createdAt: facility.createdAt.toISOString(),
//         approvedAt: facility.approvedAt?.toISOString(),
//         mediaUrls: facility.mediaUrls as string[],
//       } as TFacilityTable;
//     }),

//   getTopRatedFacilities: protectedProcedure
//     .input(z.object({ limit: z.number().min(1).max(100).default(10) }))
//     .query(async ({ input }) => {
//       const { limit } = input;
//       const facilities = await db.query.facilityProfile.findMany({
//         where: eq(facilityProfile.status, "active"),
//         with: {
//           owner: true,
//         },
//         orderBy: desc(facilityProfile.avgRating),
//         limit,
//       });
//       return facilities;
//     }),

//   getFacilitiesMapData: protectedProcedure
//     .input(
//       z.object({
//         minLng: z.number(),
//         minLat: z.number(),
//         maxLng: z.number(),
//         maxLat: z.number(),
//         zoom: z.number(),
//       })
//     )
//     .query(async ({ input }) => {
//       const { minLng, minLat, maxLng, maxLat, zoom } = input;
//       const limit = zoom < 10 ? 1000 : 5000;

//       try {
//         // Senior Move: If zoom is low (zoomed out), use Clustering or Limit data
//         // If zoom is high (zoomed in), show all facilities in the view
//         //get the facilites using Bounding Box: basically get all facilities that user is looking at
//         const facilities = await db.execute(sql`
//           SELECT jsonb_build_object(
//             'type', 'FeatureCollection',
//             'features', COALESCE(jsonb_agg(features.feature), '[]'::jsonb) -- IMPORTANT: Fallback to empty array
//           )
//           FROM (
//             SELECT jsonb_build_object(
//               'type', 'Feature',
//               'geometry', ST_AsGeoJSON(ST_MakePoint(longitude, latitude))::jsonb,
//               'properties', jsonb_build_object('id', id, 'name', facility_name, 'type', facility_type)
//             ) AS feature
//             FROM facility_profile
//             WHERE longitude BETWEEN ${minLng} AND ${maxLng}
//               AND latitude BETWEEN ${minLat} AND ${maxLat}
//             LIMIT ${limit} -- Safety cap to prevent browser crash
//           ) features
//         `);

//         return facilities.rows[0].jsonb_build_object;
//       } catch (error) {
//         console.error("Error fetching map data for facilities: ", error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message:
//             "Database error while fetching map data for facilities: " + error,
//         });
//       }
//     }),
// });
