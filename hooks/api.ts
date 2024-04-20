import { trpcClient } from "@/client";

import type { Router } from "@/server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const api = trpcClient;

export type ApiInputs = inferRouterInputs<Router>;

export type ApiOutputs = inferRouterOutputs<Router>;
