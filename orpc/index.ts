import { os } from "@orpc/server";

import { db } from "@/lib/db";

export const createORPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

const o = os.$context<Awaited<ReturnType<typeof createORPCContext>>>();

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (process.env.NODE_ENV === "development") {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();
  const end = Date.now();

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`[ORPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const publicProcedure = o.use(timingMiddleware);
