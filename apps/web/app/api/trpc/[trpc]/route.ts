import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@4ol/api";
import { auth } from "@4ol/api/auth";
import { db } from "@4ol/db";

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      // Get session from Better Auth
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      return {
        db,
        session,
      };
    },
  });
};

export { handler as GET, handler as POST };
