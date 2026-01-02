import { db, dbTransact } from "@4ol/db";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { user, user_invites, user_profiles } from "@4ol/db/models/auth.model";
import {
  adminInviteSchema,
  AdminInviteSchema,
  TUserProfileWithUser,
  userRegistrationSchema,
} from "@4ol/db/schemas/user-profile.schema";
import z from "zod";
import { eq, inArray, like, or, sql } from "drizzle-orm";
import { ROLE_ENUM, STATUS_ENUM } from "@4ol/db/types/formInput";
import { TRPCError } from "@trpc/server";

export const userProfilesRouter = router({
  getProfile: publicProcedure.query(async () => {
    return await db.query.user_profiles.findFirst();
  }),

  allUsers: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        status: z.enum(STATUS_ENUM).optional(),
        admin: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search, status, admin } = input;
      const offset = (page - 1) * limit;

      // Build where clause
      const whereConditions = [];

      if (search) {
        whereConditions.push(
          or(
            like(user_profiles.firstName, `%${search}%`),
            like(user_profiles.lastName, `%${search}%`),
            like(user_profiles.phoneNumber, `%${search}%`)
          )
        );
      }
      if (status) {
        whereConditions.push(eq(user_profiles.status, status));
      }

      if (admin) {
        const adminRoles = ROLE_ENUM.filter((role) => role !== "user");
        whereConditions.push(inArray(user_profiles.role, adminRoles));
      } else {
        whereConditions.push(eq(user_profiles.role, "user"));
      }

      // Fetch paginated data
      const [users, [{ count }]] = await Promise.all([
        db
          .select({
            userId: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user_profiles.phoneNumber,
            status: user_profiles.status,
            role: user_profiles.role,
            createdAt: user_profiles.createdAt,
            updatedAt: user_profiles.updatedAt,
            dob: user_profiles.dob,
            sex: user_profiles.sex,
            userType: user_profiles.userType,
          })
          .from(user_profiles)
          .where(whereConditions.length ? or(...whereConditions) : undefined)
          .limit(limit)
          .offset(offset)
          .leftJoin(user, eq(user_profiles.userId, user.id)),

        db
          .select({ count: sql<number>`count(*)` })
          .from(user_profiles)
          .where(whereConditions.length ? or(...whereConditions) : undefined),
      ]);

      // Get stats
      const stats = await db
        .select({
          status: user_profiles.status,
          count: sql<number>`count(*)`,
        })
        .from(user_profiles)
        .where(whereConditions.length ? or(...whereConditions) : undefined)
        .groupBy(user_profiles.status);

      return {
        users: users as TUserProfileWithUser[],
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
        currentPage: page,
        stats: {
          active: stats.find((s) => s.status === "active")?.count || 0,
          pending: stats.find((s) => s.status === "pending")?.count || 0,
          inactive: stats.find((s) => s.status === "inactive")?.count || 0,
          suspended: stats.find((s) => s.status === "suspended")?.count || 0,
        },
      };
    }),

  createProfile: publicProcedure
    .input(
      userRegistrationSchema
        .omit({ password: true, confirmPassword: true })
        .extend({
          userId: z.string(),
        })
    )
    .mutation(async ({ input, ctx }) => {
      return await dbTransact.transaction(async (tx) => {
        //1. insert into user_profiles table
        const [profile] = await tx
          .insert(user_profiles)
          .values({
            userId: input.userId,
            firstName: input.firstName,
            lastName: input.lastName,
            sex: input.sex,
            dob: input.dob,
            userType: input.userType,
            role: input.role,
            phoneNumber: input.phoneNumber,
          })
          .returning();
        //2. update activity_logs table

        return profile;
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const { id } = input;
        const [userFound] = await db
          .select({
            userId: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user_profiles.phoneNumber,
            status: user_profiles.status,
            role: user_profiles.role,
            createdAt: user_profiles.createdAt,
            updatedAt: user_profiles.updatedAt,
            dob: user_profiles.dob,
            sex: user_profiles.sex,
            userType: user_profiles.userType,
          })
          .from(user_profiles)
          .where(eq(user_profiles.userId, id))
          .leftJoin(user, eq(user_profiles.userId, user.id));

        return userFound as TUserProfileWithUser;
      } catch (error) {
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
          cause: error,
        });
      }
    }),

  insertAdminInvite: protectedProcedure
    .input(adminInviteSchema)
    .mutation(async ({ input }) => {
      try {
        const { email, role, token, expiresAt } = input;

        const existingInvite = await db.query.user_invites.findFirst({
          where: eq(user_invites.email, email),
        });

        if (existingInvite) {
          throw new TRPCError({
            message: "User already invited",
            code: "BAD_REQUEST",
          });
        }

        const [invite] = await db
          .insert(user_invites)
          .values({
            email,
            role,
            token,
            expiresAt,
          })
          .returning();

        return invite as AdminInviteSchema;
      } catch (error) {
        throw new TRPCError({
          message:
            (error as TRPCError).message || "Failed to insert admin invite",
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }),

  getInvitedAdmin: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const { token } = input;
        const [userFound] = await db
          .select({
            email: user_invites.email,
            token: user_invites.token,
            role: user_invites.role,
            expiresAt: user_invites.expiresAt,
          })
          .from(user_invites)
          .where(eq(user_invites.token, token));

        return userFound as AdminInviteSchema;
      } catch (error) {
        throw new TRPCError({
          message: "Invited admin not found",
          code: "NOT_FOUND",
          cause: error,
        });
      }
    }),
});
