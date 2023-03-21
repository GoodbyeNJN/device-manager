import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/server/db";
import { checkPassword } from "@/utils";

import { authPages } from "./pages";

const credentialsProvider = CredentialsProvider({
    credentials: {
        username: {},
        password: {},
    },

    async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { username: credentials.username },
        });
        if (!user) {
            return null;
        }

        const { password, ...userWithoutPassword } = user;
        const passed = await checkPassword(credentials.password, password);
        if (!passed) {
            return null;
        }

        return userWithoutPassword;
    },
});

export const authOptions: NextAuthOptions = {
    providers: [credentialsProvider],

    pages: authPages,

    callbacks: {
        session(options) {
            // 各参数的含义详见类型定义
            const { session, token } = options;

            if (token.user) {
                session.user = token.user;
            }

            return session;
        },

        jwt(options) {
            // 各参数的含义详见类型定义
            const { token, user } = options;

            if (user) {
                token.user = user;
            }

            return token;
        },
    },

    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },
};
