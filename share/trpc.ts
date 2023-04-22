import { createTRPCProxyClient, httpBatchLink, httpLink, loggerLink } from "@trpc/client";
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

    // dev SSR should use env var
    const url = new URL(process.env.NEXTAUTH_URL || window.location.href);
    return url.origin;
};

/**
 * A set of type-safe react-query hooks for your tRPC API.
 */
export const trpcNextClient = createTRPCNext<Router>({
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

export const trpcStandaloneClient = createTRPCProxyClient<Router>({
    transformer: superjson,

    links: [
        loggerLink({
            enabled: opts =>
                isDevEnv || (opts.direction === "down" && opts.result instanceof Error),
        }),

        httpLink({
            url: `http://localhost:${process.env.PORT ?? 3000}/api/trpc`,
        }),
    ],
});
