import { t } from "./init";
import { isAuthed, loggerMiddleware } from "./middleware";

const commonProcedure = t.procedure;
// const commonProcedure = t.procedure.use(loggerMiddleware);

export const publicProcedure = commonProcedure;

export const protectedProcedure = commonProcedure.use(isAuthed);
