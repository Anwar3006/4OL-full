import { router } from "./trpc";
import { userProfilesRouter } from "./routers/user-profiles";
import { storageRouter } from "./routers/media-storage";
import { facilityProfileRouter } from "./routers/facility-profiles";
import { marketingProfileRouter } from "./routers/marketing-profiles";
import { conditionsRouter } from "./routers/conditions-router";
import { symptomsRouter } from "./routers/symptoms-router";

export const appRouter = router({
  userProfiles: userProfilesRouter,
  mediaStorage: storageRouter,
  facilityProfiles: facilityProfileRouter,
  marketingProfiles: marketingProfileRouter,
  conditionsRouter: conditionsRouter,
  symptomsRouter: symptomsRouter,
});

// Export the type for the client
export type AppRouter = typeof appRouter;

// Also export the instance for Next.js API routes
export { appRouter as default };
export * from "./trpc"; // Export publicProcedure, protectedProcedure, etc.
