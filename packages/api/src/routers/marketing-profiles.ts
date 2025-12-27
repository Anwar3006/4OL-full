import { marketingProfileSchema } from "@4ol/db/schemas/marketing-profile.schema";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { marketingProfile } from "@4ol/db/models/marketing.model";
import { db } from "@4ol/db";
import { eq, like, or, sql } from "drizzle-orm";
import z from "zod";
import { TMarketingProfile } from "@4ol/db/schemas/marketing-profile.schema";

export const marketingProfileRouter = router({
  createCampaign: protectedProcedure
    .input(marketingProfileSchema)
    .mutation(async ({ input }) => {
      try {
        const linksArray: string[] = Object.values(input.links).filter(
          (link): link is string => typeof link === "string" && link.length > 0
        );

        const inputData = {
          ...input,
          links: linksArray,
          imageUrl: input.imageUrl ?? "",
        };

        const [result] = await db
          .insert(marketingProfile)
          .values(inputData)
          .returning();

        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error while saving marketing profile.",
          cause: error,
        });
      }
    }),

  getCampaigns: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { search, page, limit, status } = input;
        const whereConditions = [];
        const offset = (page - 1) * limit;

        if (search) {
          whereConditions.push(
            or(
              like(marketingProfile.headline, `%${search}%`),
              like(marketingProfile.description, `%${search}%`),
              like(marketingProfile.organization, `%${search}%`)
            )
          );
        }

        const [campaigns, [{ count }]] = await Promise.all([
          db
            .select()
            .from(marketingProfile)
            .where(
              whereConditions.length > 0 ? or(...whereConditions) : undefined
            )
            .limit(limit)
            .offset(offset),

          db
            .select({
              count: sql<number>`count(*)`,
            })
            .from(marketingProfile)
            .where(
              whereConditions.length > 0 ? or(...whereConditions) : undefined
            ),
        ]);

        const stats = await db
          .select({
            status: marketingProfile.status,
            count: sql<number>`count(*)`,
          })
          .from(marketingProfile)
          .where(
            whereConditions.length > 0 ? or(...whereConditions) : undefined
          )
          .groupBy(marketingProfile.status);

        return {
          campaigns: campaigns as TMarketingProfile[],
          total: Number(count),
          totalPages: Math.ceil(Number(count) / limit),
          currentPage: page,
          stats: {
            draft: stats.find((s) => s.status === "draft")?.count || 0,
            scheduled: stats.find((s) => s.status === "scheduled")?.count || 0,
            live: stats.find((s) => s.status === "live")?.count || 0,
            paused: stats.find((s) => s.status === "paused")?.count || 0,
            ended: stats.find((s) => s.status === "ended")?.count || 0,
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error while fetching marketing profiles.",
          cause: error,
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const campaign = await db.query.marketingProfile.findFirst({
        where: eq(marketingProfile.id, id),
      });
      return campaign as TMarketingProfile & { createdAt: Date };
    }),
});
