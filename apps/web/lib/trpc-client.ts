import { httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc";

function getBaseUrl() {
  // Browser should use relative path
  if (typeof window !== "undefined") return "";

  // SSR should use vercel url or localhost
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Development fallback
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // Dynamic URL that works in all environments
      url: `${getBaseUrl()}/api/trpc`,

      // Automatically include cookies for Better Auth
      headers() {
        return {
          // In browser, cookies are sent automatically
          // In SSR, you'd need to forward them
        };
      },
    }),
  ],
});
