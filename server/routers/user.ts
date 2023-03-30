import { type CredentialsConfig } from "next-auth/providers";
import { z } from "zod";

import { ForbiddenError } from "@/server/error";
import { t } from "@/server/init";
import { protectedProcedure } from "@/server/procedure";
import { hashPassword } from "@/utils";

export type OutsideReq = Parameters<CredentialsConfig["authorize"]>[1];

export const userRouter = t.router({
    info: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                nickname: z.string().optional(),
                password: z.string().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { id, nickname, password } = input;

            const user = await ctx.prisma.user.findUnique({ where: { id } });

            if (!user || user.id !== ctx.session.user.id) {
                throw new ForbiddenError();
            }

            if (!nickname && !password) {
                return user;
            }

            const data: Omit<typeof input, "id"> = {};

            if (nickname) {
                data.nickname = nickname;
            }

            if (password) {
                data.password = await hashPassword(password);
            }

            const updatedUser = await ctx.prisma.user.update({
                where: { id },
                data,
            });

            return updatedUser;
        }),
});
