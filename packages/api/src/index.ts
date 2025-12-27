import { router } from "./trpc";
import { userProfilesRouter } from "./routers/user-profiles";
import { storageRouter } from "./routers/media-storage";
import { facilityProfileRouter } from "./routers/facility-profiles";
import { marketingProfileRouter } from "./routers/marketing-profiles";

export const appRouter = router({
  userProfiles: userProfilesRouter,
  mediaStorage: storageRouter,
  facilityProfiles: facilityProfileRouter,
  marketingProfiles: marketingProfileRouter,
});

// Export the type for the client
export type AppRouter = typeof appRouter;

// Also export the instance for Next.js API routes
export { appRouter as default };
export * from "./trpc"; // Export publicProcedure, protectedProcedure, etc.
