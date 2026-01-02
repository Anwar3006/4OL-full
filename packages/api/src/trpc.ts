import { initTRPC, TRPCError } from "@trpc/server";
import { db, dbTransact } from "@4ol/db";
import type { Session } from "./auth";

//tRPC Context with Better Auth Session
export interface Context {
  db: typeof db;
  session: Session | null;
}

// Initialize the tRPC context and "engine" once
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;
// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      userId: ctx.session.user.id,
    },
  });
});
