// import { db, dbTransact } from "@4ol/db";
// import { router, publicProcedure, protectedProcedure } from "../trpc";
// import { user, user_invites, user_profiles } from "@4ol/db/models/auth.model";
// import {
//   adminInviteSchema,
//   AdminInviteSchema,
//   TUserProfileWithUser,
//   userRegistrationSchema,
// } from "@4ol/db/schemas/user-profile.schema";
// import z from "zod";
// import { and, eq, inArray, like, or, sql } from "drizzle-orm";
// import { ROLE_ENUM, STATUS_ENUM } from "@4ol/db/types/formInput";
// import { TRPCError } from "@trpc/server";

// export const userProfilesRouter = router({
//   getById: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .query(async ({ input }) => {
//       try {
//         const { id } = input;
//         const [userFound] = await db
//           .select({
//             userId: user.id,
//             name: user.name,
//             email: user.email,
//             phoneNumber: user_profiles.phoneNumber,
//             status: user_profiles.status,
//             role: user_profiles.role,
//             createdAt: user_profiles.createdAt,
//             updatedAt: user_profiles.updatedAt,
//             dob: user_profiles.dob,
//             sex: user_profiles.sex,
//             userType: user_profiles.userType,
//           })
//           .from(user_profiles)
//           .where(eq(user_profiles.userId, id))
//           .leftJoin(user, eq(user_profiles.userId, user.id));

//         return userFound as TUserProfileWithUser;
//       } catch (error) {
//         throw new TRPCError({
//           message: "User not found",
//           code: "NOT_FOUND",
//           cause: error,
//         });
//       }
//     }),

//   insertAdminInvite: protectedProcedure
//     .input(adminInviteSchema)
//     .mutation(async ({ input }) => {
//       try {
//         const { email, role, token, expires_at } = input;

//         const existingInvite = await db.query.user_invites.findFirst({
//           where: eq(user_invites.email, email),
//         });

//         if (existingInvite) {
//           throw new TRPCError({
//             message: "User already invited",
//             code: "BAD_REQUEST",
//           });
//         }

//         const [invite] = await db
//           .insert(user_invites)
//           .values({
//             email,
//             role,
//             token,
//             expires_at,
//           })
//           .returning();

//         return invite as AdminInviteSchema;
//       } catch (error) {
//         throw new TRPCError({
//           message:
//             (error as TRPCError).message || "Failed to insert admin invite",
//           code: "INTERNAL_SERVER_ERROR",
//           cause: error,
//         });
//       }
//     }),

//   getInvitedAdmin: protectedProcedure
//     .input(z.object({ token: z.string() }))
//     .query(async ({ input }) => {
//       try {
//         const { token } = input;
//         const [userFound] = await db
//           .select({
//             email: user_invites.email,
//             token: user_invites.token,
//             role: user_invites.role,
//             expiresAt: user_invites.expiresAt,
//           })
//           .from(user_invites)
//           .where(eq(user_invites.token, token));

//         return userFound as AdminInviteSchema;
//       } catch (error) {
//         throw new TRPCError({
//           message: "Invited admin not found",
//           code: "NOT_FOUND",
//           cause: error,
//         });
//       }
//     }),
// });
