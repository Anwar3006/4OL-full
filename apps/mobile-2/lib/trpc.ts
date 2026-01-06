import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@4ol/api';

/**
 * tRPC React hooks for React Native
 * Provides type-safe API calls with React Query integration
 * 
 * @example
 * import { trpc } from '@/lib/trpc';
 * 
 * function Component() {
 *   const { data, isLoading } = trpc.facilities.getFacilities.useQuery();
 *   return <View>{data?.facilities.map(...)}</View>;
 * }
 */
export const trpc = createTRPCReact<AppRouter>();
