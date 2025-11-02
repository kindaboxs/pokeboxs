import { headers } from "next/headers";

import { ORPCError, os } from "@orpc/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const createORPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    db,
    session,
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

const authMiddleware = o.middleware(async ({ next, context }) => {
  if (!context.session) {
    throw new ORPCError("UNAUTHORIZED", {
      cause: "Unauthorized",
      message: "You are not authorized to perform this action",
      status: 401,
    });
  }

  return next({
    context: {
      ...context,
      auth: {
        session: context.session.session,
        user: context.session.user,
      },
    },
  });
});

export const publicProcedure = o.use(timingMiddleware);
export const protectedProcedure = publicProcedure.use(authMiddleware);
