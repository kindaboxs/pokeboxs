import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

import { serializer } from "@/orpc/serializer";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey);
          return JSON.stringify({ json, meta });
        },
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },

      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        serializeData(data) {
          const [json, meta] = serializer.serialize(data);
          return { json, meta };
        },
      },

      hydrate: {
        deserializeData(data) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          return serializer.deserialize(data.json, data.meta);
        },
      },
    },
  });
