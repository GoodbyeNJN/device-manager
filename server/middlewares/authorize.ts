import { db } from "@/db";
import { verify } from "@/utils";

import { UnauthorizedError } from "../error";
import { trpc } from "../trpc";

export const isAuthorized = trpc.middleware(async ({ ctx, next }) => {
    if (!ctx.token) {
        throw new UnauthorizedError();
    }

    const res = await verify(ctx.token);
    if (!res.isValid) {
        throw new UnauthorizedError();
    }

    const user = R.pipe(
        db.data.users,
        R.find(user => user.id === res.id),
    );
    if (!user) {
        throw new UnauthorizedError();
    }

    return next({
        ctx: { ...ctx, user },
    });
});
