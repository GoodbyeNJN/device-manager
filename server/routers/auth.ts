import { z } from "zod";

import { ForbiddenError } from "../error";
import { procedure } from "../procedures";
import { trpc } from "../trpc";
import { sign } from "../utils";

import type { UserEntity } from "../db";

export const authRouter = trpc.router({
    signUp: procedure.public
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { username, password } = input;

            const user: UserEntity = {
                id: ctx.db.generateId(),
                username,
                password,
            };

            await ctx.db.update(data => {
                data.users.push(user);
            });

            const { password: _password, ...userWithoutPassword } = user;

            return userWithoutPassword;
        }),

    signIn: procedure.public
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { username, password } = input;

            const user = R.pipe(
                ctx.db.data.users,
                R.find(user => user.username === username),
            );
            if (!user || user.password !== password) {
                throw new ForbiddenError("用户名或密码错误");
            }

            const token = await sign(user.id);

            return token;
        }),
});
