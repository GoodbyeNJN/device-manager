import { type CredentialsConfig } from "next-auth/providers";
import { z } from "zod";

import { ForbiddenError } from "@/server/error";
import { t } from "@/server/init";
import { publicProcedure } from "@/server/procedure";
import { checkPassword, hashPassword } from "@/utils";

export type OutsideReq = Parameters<CredentialsConfig["authorize"]>[1];

export const authRouter = t.router({
    signUp: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { username, password } = input;

            const hashedPassword = await hashPassword(password);
            const user = await ctx.prisma.user.create({
                data: { username, password: hashedPassword },
            });

            const { password: _dbPassword, ...userWithoutPassword } = user;

            return userWithoutPassword;
        }),

    signIn: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
                outsideReq: z.custom<OutsideReq>().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { username, password } = input;

            const user = await ctx.prisma.user.findUnique({
                where: { username },
            });
            if (!user) {
                throw new ForbiddenError("用户名或密码错误");
            }

            const { password: dbPassword, ...userWithoutPassword } = user;

            const passed = await checkPassword(password, dbPassword);
            if (!passed) {
                throw new ForbiddenError("用户名或密码错误");
            }

            return userWithoutPassword;
        }),
});
