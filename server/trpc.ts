import { initTRPC } from "@trpc/server";

import type { Context } from "./context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const trpc = initTRPC.context<Context>().create({
    errorFormatter: ({ shape }) => shape,
});
