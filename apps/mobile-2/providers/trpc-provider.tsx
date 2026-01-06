import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';
import { trpcClient } from '../lib/trpc-client';

interface TRPCProviderProps {
  children: React.ReactNode;
}

/**
 * tRPC Provider for React Native
 * Wraps your app to enable tRPC hooks throughout the component tree
 * 
 * @example
 * // In App.tsx or _layout.tsx
 * import { TRPCProvider } from './providers/trpc-provider';
 * 
 * export default function App() {
 *   return (
 *     <TRPCProvider>
 *       <YourAppContent />
 *     </TRPCProvider>
 *   );
 * }
 */
export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered stale after 1 minute
            staleTime: 60 * 1000,
            
            // Retry failed requests twice
            retry: 2,
            
            // Don't retry on auth errors (401/403)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // Refetch on reconnect
            refetchOnReconnect: true,
            
            // Don't refetch on window focus (mobile doesn't have windows)
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Only retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
