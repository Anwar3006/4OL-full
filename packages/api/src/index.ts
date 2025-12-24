import { router } from "./trpc";
import { userProfilesRouter } from "./routers/user-profiles";

export const appRouter = router({
  userProfiles: userProfilesRouter,

  // Add more routers here as you build them
});

// Export the type for the client
export type AppRouter = typeof appRouter;

// Also export the instance for Next.js API routes
export { appRouter as default };
export * from "./trpc"; // Export publicProcedure, protectedProcedure, etc.
