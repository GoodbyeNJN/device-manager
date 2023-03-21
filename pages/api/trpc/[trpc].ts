import { createNextApiHandler } from "@trpc/server/adapters/next";

import { createContext, router } from "@/server";
import { logger } from "@/utils";

export default createNextApiHandler({
    router,
    createContext,
    onError: ({ path, error }) => {
        logger.error(`tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
    },
});
