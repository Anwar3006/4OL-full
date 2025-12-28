// Define apis for the facility profiles

import {
  facilityProfileSchema,
  TFacilityTable,
} from "@4ol/db/schemas/facility-profile.schema";
import { protectedProcedure, router } from "../trpc";
import { db, dbTransact } from "@4ol/db";
import { user, user_profiles } from "@4ol/db/models/auth.model";
import { auth } from "../auth";
import { TRPCError } from "@trpc/server";
import { facilityProfile } from "@4ol/db/models/facility.model";
import { and, desc, eq, ilike, like, or, sql } from "drizzle-orm";
import { queryPaginationSchema } from "@4ol/db/schemas/pagination.schema";
import z from "zod";
import { s3Client } from "../s3Client";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const facilityProfileRouter = router({
  insertFacility: protectedProcedure
    .input(facilityProfileSchema)
    .mutation(async ({ input }) => {
      // check if user with email exists
      const userExists = await db.query.user.findFirst({
        where: eq(user.email, input.ownerEmail),
      });

      // insert into auth table first to get the ownerId which is the auth.id
      let result: any;
      if (userExists) {
        result = userExists;
      } else {
        const authResult = await auth.api.signUpEmail({
          body: {
            name: `${input.firstName} ${input.lastName}`,
            email: input.ownerEmail,
            password: input.gpsAddress,
          },
        });

        if (!authResult.user) {
          throw new TRPCError({
            message: "Error creating betterAuth user",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        result = authResult.user;
      }

      try {
        return await dbTransact.transaction(async (tx) => {
          const existingProfile = await tx.query.user_profiles.findFirst({
            where: (up, { eq }) => eq(up.userId, result.id),
          });
          // console.log("User : ", result);
          const newUserProfile = {
            userId: result.user ? result.user.id : result.id,
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNumber: input.personContactNumber,
            userType: "business_provider" as const,
            role: "user" as const,
            dob: "",
            sex: "male" as const,
          };

          // console.log("User Profile: ", newUserProfile);
          // add user to user_profiles if it doesn't exist
          if (!existingProfile) {
            await tx.insert(user_profiles).values(newUserProfile);
          }

          // now insert into facility_profile
          const [facility] = await tx
            .insert(facilityProfile)
            .values({
              ...input, // Using spread to keep it clean
              ownerId: result.user ? result.user.id : result.id,
              location: sql`ST_SetSRID(ST_MakePoint(${input.longitude}, ${input.latitude}), 4326)`,
              status: "pending",
              whatsappNumber: input.whatsappNumber ? input.whatsappNumber : "",
              position: input.position ? input.position : "",
              keywords: input.keywords ? input.keywords.split(",") : [],
            })
            .returning();

          return facility;
        });
      } catch (error) {
        console.error("Facility Transaction Failed:", error);

        // If it was a new user, you now have an Auth record but no profile.
        // In a perfect world, you'd delete the auth user here if !userExists,
        // but usually, letting them keep the account is acceptable.
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error while saving facility profile.",
          cause: error,
        });
      }
    }),

  approveFacility: protectedProcedure
    .input(z.object({ facilityId: z.string(), imageKeys: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const { facilityId, imageKeys } = input;
      const facilityToApprove = await db.query.facilityProfile.findFirst({
        where: eq(facilityProfile.id, facilityId),
      });

      if (!facilityToApprove) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Facility not found",
        });
      }

      if (facilityToApprove.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Facility is already approved or rejected",
        });
      }

      const moveApprovedImagesPromise = imageKeys.map(async (oldFilePath) => {
        const cleanOldPath = oldFilePath.startsWith("/")
          ? oldFilePath.slice(1)
          : oldFilePath;
        const newFilePath = cleanOldPath.replace("temporary", "approved");

        // Check if replacement actually happened to prevent self-copy
        if (cleanOldPath === newFilePath) {
          console.error(
            `Skip copy: Source and destination are identical for ${cleanOldPath}`
          );
          return cleanOldPath;
        }

        // Copy them over to new filepath
        await s3Client.send(
          new CopyObjectCommand({
            Bucket: process.env.OCI_BUCKET_NAME,
            CopySource: `${process.env.OCI_BUCKET_NAME}/${cleanOldPath}`,
            Key: newFilePath,
            MetadataDirective: "COPY",
          })
        );

        // Delete old filepath
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.OCI_BUCKET_NAME,
            Key: oldFilePath,
          })
        );

        return newFilePath;
      });

      await dbTransact.transaction(async (tx) => {
        const newFilePaths = await Promise.all(moveApprovedImagesPromise);
        await tx.update(facilityProfile).set({
          status: "active",
          approvedAt: new Date(),
          mediaUrls: newFilePaths,
        });
      });

      return {
        code: "OK",
        message: "Facility approved successfully",
      };
    }),

  getFacilities: protectedProcedure
    .input(
      queryPaginationSchema.extend({
        includeStatsOnly: z.boolean().default(false), // Toggle for Overview page
      })
    )
    .query(async ({ input }) => {
      const { limit, page, search, status, type, includeStatsOnly } = input;
      const offset = (page - 1) * limit;

      // 1. Build the dynamic WHERE clause for shared filtering
      const filters = [];
      if (status) filters.push(eq(facilityProfile.status, status));
      if (type) filters.push(eq(facilityProfile.facilityType, type));
      if (search) {
        filters.push(
          or(
            ilike(facilityProfile.facilityName, `%${search}%`),
            ilike(facilityProfile.district, `%${search}%`),
            ilike(facilityProfile.region, `%${search}%`)
          )
        );
      }

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      // 2. Parallel Database Execution
      const [facilities, countRes, stats] = await Promise.all([
        // Only fetch list if NOT in "Stats Only" mode
        !includeStatsOnly
          ? db
              .select()
              .from(facilityProfile)
              .where(whereClause)
              .limit(limit)
              .offset(offset)
          : Promise.resolve([]),

        db
          .select({ count: sql<number>`count(*)` })
          .from(facilityProfile)
          .where(whereClause),

        // Fetch stats based on the same filters (Context-Aware Stats)
        db
          .select({
            status: facilityProfile.status,
            count: sql<number>`count(*)`,
          })
          .from(facilityProfile)
          .where(whereClause) // This makes stats update as you search
          .groupBy(facilityProfile.status),
      ]);

      const totalCount = Number(countRes[0]?.count ?? 0);

      return {
        facilities,
        meta: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        },
        stats: {
          active: stats.find((s) => s.status === "active")?.count || 0,
          inactive: stats.find((s) => s.status === "inactive")?.count || 0,
          pending: stats.find((s) => s.status === "pending")?.count || 0,
          rejected: stats.find((s) => s.status === "rejected")?.count || 0,
          totalInContext: stats.reduce((acc, s) => acc + Number(s.count), 0),
        },
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const facility = await db.query.facilityProfile.findFirst({
        where: eq(facilityProfile.id, id),
        with: {
          owner: true,
        },
      });
      if (!facility) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Facility not found",
        });
      }
      return {
        ...facility,
        createdAt: facility.createdAt.toISOString(),
      } as TFacilityTable;
    }),

  getTopRatedFacilities: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(10) }))
    .query(async ({ input }) => {
      const { limit } = input;
      const facilities = await db.query.facilityProfile.findMany({
        where: eq(facilityProfile.status, "active"),
        with: {
          owner: true,
        },
        orderBy: desc(facilityProfile.avgRating),
        limit,
      });
      return facilities;
    }),
});
