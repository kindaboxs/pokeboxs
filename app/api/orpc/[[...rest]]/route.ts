import { NextResponse, type NextRequest } from "next/server";

import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

import { createORPCContext } from "@/orpc";
import { appRouter } from "@/orpc/routers";

const createContext = async (req: NextRequest) => {
  return createORPCContext({
    headers: req.headers,
  });
};

const orpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const handleRequest = async (req: NextRequest) => {
  const orpcResult = await orpcHandler.handle(req, {
    prefix: "/api/orpc",
    context: await createContext(req),
  });
  if (orpcResult.response) return orpcResult.response;

  const apiResult = await apiHandler.handle(req, {
    prefix: "/api/orpc/api-reference",
    context: await createContext(req),
  });
  if (apiResult.response) return apiResult.response;

  return NextResponse.json({ message: "Not Found" }, { status: 404 });
};

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
