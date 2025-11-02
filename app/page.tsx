import { Suspense } from "react";

import { HealthCheck } from "@/app/health-check";
import { HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/orpc/client";
import { getQueryClient } from "@/orpc/server";

export default function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(orpc.healthCheck.queryOptions());

  return (
    <HydrateClient client={queryClient}>
      <Suspense fallback={<p>Loading...</p>}>
        <HealthCheck />
      </Suspense>
    </HydrateClient>
  );
}
