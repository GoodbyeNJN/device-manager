import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

import { type Router } from "@/server";

const getBaseUrl = () => {
    // browser should use relative url
    if (isServerEnv) {
        return "";
    }

    // SSR should use vercel url
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // dev SSR should use localhost
    return `http://wsl.lan:${process.env.PORT ?? 3000}`;
};

/**
 * A set of type-safe react-query hooks for your tRPC API.
 */
export const trpc = createTRPCNext<Router>({
    config: () => ({
        transformer: superjson,

        /**
         * Links used to determine request flow from client to server.
         *
         * @see https://trpc.io/docs/links
         */
        links: [
            loggerLink({
                enabled: opts =>
                    isDevEnv || (opts.direction === "down" && opts.result instanceof Error),
            }),

            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
            }),
        ],
    }),

    /**
     * Whether tRPC should await queries when server rendering pages.
     *
     * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
     */
    ssr: false,
});
