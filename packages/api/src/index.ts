import { router } from "./trpc";

import { storageRouter } from "./routers/media-storage";

// import { conditionsRouter } from "./routers/conditions-router";
// import { symptomsRouter } from "./routers/symptoms-router";
// import { healthyLivingRouter } from "./routers/healthyLiving-router";

export const appRouter = router({
  mediaStorage: storageRouter,

  // conditionsRouter: conditionsRouter,
  // symptomsRouter: symptomsRouter,
  // healthyLivingRouter: healthyLivingRouter,
});

// Export the type for the client
export type AppRouter = typeof appRouter;

// Also export the instance for Next.js API routes
export { appRouter as default };
export * from "./trpc"; // Export publicProcedure, protectedProcedure, etc.
