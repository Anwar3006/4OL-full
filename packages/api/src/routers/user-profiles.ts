import { db, dbTransact } from "@4ol/db";
import { router, publicProcedure } from "../trpc";

export const userProfilesRouter = router({
  getProfile: publicProcedure.query(async () => {
    return await db.query.user_profiles.findFirst();
  }),

  cProfile: publicProcedure.mutation(async ({ input }: any) => {
    return await dbTransact.transaction(async (tx) => {
      //1. insert into user_profiles table
      //2. update activity_logs table
    });
  }),
});
