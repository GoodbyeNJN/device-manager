import dayjs from "dayjs";

import { createLogger } from "@/utils";

import { trpc } from "../trpc";

const logger = createLogger("[trpc-middleware]");

export const loggerMiddleware = trpc.middleware(async options => {
    const { type, path, next } = options;
    const date = dayjs();
    const dateStr = date.format("YYYY-MM-DD HH:mm:ss");

    try {
        const result = await next();

        const duration = dayjs().diff(date, "ms");
        const message = `${type} - ${path} - ${duration}ms`;

        if (result.ok) {
            logger.info(dateStr, message);
        } else {
            throw result.error;
        }

        return result;
    } catch (error) {
        const duration = dayjs().diff(date, "ms");
        const message = `${type} - ${path} - ${duration}ms`;

        logger.error(dateStr, message);

        throw error;
    }
});
