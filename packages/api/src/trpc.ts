import { initTRPC } from "@trpc/server";
import { db, dbTransact } from "@4ol/db";

// Initialize the tRPC context and "engine" once
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
