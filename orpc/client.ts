import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type InferRouterInputs, type InferRouterOutputs } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { type AppRouter, type AppRouterClient } from "@/orpc/routers";

declare global {
  var $client: AppRouterClient | undefined;
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = InferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = InferRouterOutputs<AppRouter>;

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const link = new RPCLink({
  url: getBaseUrl() + "/api/orpc",
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },

  headers: () => {
    const headers = new Headers();
    headers.set("x-orpc-source", "nextjs-react");
    return headers;
  },
});

export const client: AppRouterClient =
  globalThis.$client ?? createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
