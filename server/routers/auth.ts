import { z } from "zod";

import { t } from "@/server/init";
import { publicProcedure } from "@/server/procedure";
import { hashPassword } from "@/utils";

export const authRouter = t.router({
    signUp: publicProcedure
        .input(z.object({ username: z.string(), password: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const { username, password } = input;

            const hashedPassword = await hashPassword(password);
            const user = await ctx.prisma.user.create({
                data: { username, password: hashedPassword },
            });

            return user;
        }),
});
