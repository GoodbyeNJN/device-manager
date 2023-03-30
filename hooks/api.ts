import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { type Router } from "@/server";

export { trpcNextClient as api } from "@/share/trpc";

export type ApiInputs = inferRouterInputs<Router>;

export type ApiOutputs = inferRouterOutputs<Router>;
