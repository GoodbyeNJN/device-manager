import dayjs from "dayjs";

import { logger } from "@/utils";

import { UnauthorizedError } from "./error";
import { t } from "./init";

export const isAuthorized = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
        throw UnauthorizedError;
    }

    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const loggerMiddleware = t.middleware(async options => {
    const { type, path, ctx, input, meta, rawInput, next } = options;
    const date = dayjs();

    try {
        const result = await next();

        const duration = dayjs().diff(date, "ms");
        const message = `${type} - ${path} - ${duration}ms`;

        result.ok ? logger.info(date, message) : logger.error(date, message);

        return result;
    } catch (error) {
        const duration = dayjs().diff(date, "ms");
        const message = `${type} - ${path} - ${duration}ms`;

        logger.error(date, message);

        throw error;
    }
});
