import appRouter from "@4ol/api/src";
import { auth } from "@4ol/api/src/auth";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";
import { headers } from "next/headers";

// This function creates a server-side tRPC caller with the appropriate context
// We use it to fetch data directly on the server without needing React Query
const createCaller = createCallerFactory()(appRouter);

export const serverApi = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Provide the context that your tRPC procedures expect (auth, db, etc.)
  return createCaller({
    session,
  });
};
