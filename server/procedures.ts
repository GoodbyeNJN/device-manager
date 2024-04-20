import { isAuthorized, loggerMiddleware } from "./middlewares";
import { trpc } from "./trpc";

const commonProcedure = trpc.procedure.use(loggerMiddleware);

export const procedure = {
    public: commonProcedure,
    protected: commonProcedure.use(isAuthorized),
};
