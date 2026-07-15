"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
            gcTime: 15 * 60 * 1000, // Cache garbage-collected after 15 minutes
            refetchOnWindowFocus: false, // Don't refetch on tab switch by default
            retry: 1, // Retry failed requests once
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
