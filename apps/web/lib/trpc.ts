import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@4ol/api";

// Create the tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();
