import { auth } from "@4ol/api/src/auth";
import { appRouter, createCallerFactory } from "@4ol/api/src";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "@4ol/db";

// This function creates a server-side tRPC caller with the appropriate context
// We use it to fetch data directly on the server without needing React Query
const createCaller = createCallerFactory(appRouter);

// Use React cache to prevent re-fetching the session multiple times
// in a single request (Request Memoization)
export const serverApi = cache(async () => {
  const head = await headers();
  const session = await auth.api.getSession({
    headers: head,
  });

  // Provide the context that your tRPC procedures expect (auth, db, etc.)
  return createCaller({
    session,
    db: db,
  });
});
