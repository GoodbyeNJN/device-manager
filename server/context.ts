import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession, type Session } from "next-auth";

import { prisma } from "@/server/db";
import { authOptions } from "@/share/options";

interface CreateContextOptions {
    session: Session | null;
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
    return { ...options, prisma };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createContext = async (options: CreateNextContextOptions) => {
    const { req, res } = options;

    // Get the session from the server using the getServerSession wrapper function
    const session = await getServerSession(req, res, authOptions);

    return createInnerContext({ session });
};
