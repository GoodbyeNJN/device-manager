import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";

import { prisma } from "@/server/db";

import { callbacks } from "./callbacks";
import { pages } from "./pages";
import { credentialsProvider } from "./providers";

export const options: NextAuthOptions = {
    providers: [credentialsProvider],
    pages,
    callbacks,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
};
