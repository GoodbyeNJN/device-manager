import { db } from "@/db";

import type { UserEntity } from "@/db";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

interface CreateContextOptions {
    token: string;
    user: UserEntity;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerContext = (options: CreateContextOptions) => {
    return { ...options, db };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createContext = async (options: CreateNextContextOptions) => {
    const { req, res } = options;

    return createInnerContext({
        token: req.headers.authorization || "",
        user: { id: "", username: "", password: "" },
    });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
