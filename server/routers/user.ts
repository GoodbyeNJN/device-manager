import { procedure } from "../procedures";
import { trpc } from "../trpc";
import { sign } from "../utils";

export const userRouter = trpc.router({
    info: procedure.protected.query(async ({ ctx }) => {
        const { password: _password, ...rest } = ctx.user;

        return rest;
    }),

    apiToken: procedure.protected.query(async ({ ctx }) => {
        const token = await sign(ctx.user.id, "3650d");

        return token;
    }),
});
