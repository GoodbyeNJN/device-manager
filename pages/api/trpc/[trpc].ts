import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter, createContext } from "@/server";
import { createLogger } from "@/utils";

const logger = createLogger("[trpc-api]");

export default createNextApiHandler({
    router: appRouter,
    createContext,
    onError: ({ path, error }) => {
        logger.error(`tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
    },
});
