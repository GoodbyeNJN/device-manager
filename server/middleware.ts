import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";

import { logger } from "@/utils";

import { t } from "./init";

export const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const loggerMiddleware = t.middleware(async options => {
    const { type, path, next } = options;
    const date = dayjs();

    const result = await next();

    const duration = dayjs().diff(date, "ms");

    logger.info(date, `${type} - ${path} - ${duration}ms`, result);

    return result;
});
