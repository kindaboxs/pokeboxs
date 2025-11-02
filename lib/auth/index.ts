import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  anonymous,
  bearer,
  openAPI,
  username,
} from "better-auth/plugins";

import { env } from "@/env";
import { db } from "@/lib/db";

export const auth = betterAuth<BetterAuthOptions>({
  appName: "pokeboxs",
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  logger: {
    level: "debug",
    disabled: env.NODE_ENV === "production",
  },
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [
    admin(),
    bearer(),
    openAPI(),
    anonymous(),
    username(),
    nextCookies(),
  ],
  secret: env.BETTER_AUTH_SECRET,
});
