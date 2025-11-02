import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { createRouterClient } from "@orpc/server";

import { createQueryClient } from "@/lib/query/client";
import { createORPCContext } from "@/orpc/index";
import { appRouter } from "@/orpc/routers";

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-orpc-source", "rsc");

  return createORPCContext({
    headers: heads,
  });
});

globalThis.$client = createRouterClient(appRouter, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: createContext,
});

export const getQueryClient = cache(createQueryClient);
