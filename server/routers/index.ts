import { t } from "@/server/init";

import { authRouter } from "./auth";
import { deviceRouter } from "./device";
import { userRouter } from "./user";

export const router = t.mergeRouters(
    authRouter,
    t.router({
        device: deviceRouter,
        user: userRouter,
    }),
);

export type Router = typeof router;
