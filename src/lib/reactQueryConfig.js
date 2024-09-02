import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: true,
      throwOnError: false,
      gcTime: 3 * 60 * 1000,
      staleTime: 0,
    },
  },
});
