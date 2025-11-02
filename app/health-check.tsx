"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/orpc/client";

export const HealthCheck = () => {
  const health = useSuspenseQuery(orpc.healthCheck.queryOptions());

  return <div>{JSON.stringify(health.data)}</div>;
};
