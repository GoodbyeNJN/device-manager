import { t } from "@/server/init";

import { authRouter } from "./auth";

export const router = t.mergeRouters(authRouter);

export type Router = typeof router;
