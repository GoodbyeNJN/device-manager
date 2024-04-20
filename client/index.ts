import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

import { storage } from "@/utils";

import { authLink } from "./authLink";

import type { Router } from "@/server";

/**
 * A set of type-safe react-query hooks for your tRPC API.
 */
export const trpcClient = createTRPCNext<Router>({
    config: () => ({
        /**
         * Links used to determine request flow from client to server.
         *
         * @see https://trpc.io/docs/links
         */
        links: [
            authLink,

            loggerLink({
                enabled: opts =>
                    import.meta.env.DEV ||
                    (opts.direction === "down" && opts.result instanceof Error),
            }),

            httpBatchLink({
                url: "/api/trpc",
                headers() {
                    const token = storage.get("token");
                    return token ? { Authorization: token } : {};
                },
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
