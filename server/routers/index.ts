import { trpc } from "../trpc";

import { authRouter } from "./auth";
import { deviceRouter } from "./device";
import { pingRouter } from "./ping";
import { userRouter } from "./user";

export const appRouter = trpc.mergeRouters(
    authRouter,
    trpc.router({
        device: deviceRouter,
        user: userRouter,
    }),
    pingRouter,
);

export type Router = typeof appRouter;
