import Credentials from "next-auth/providers/credentials";

import { trpcStandaloneClient } from "@/share/trpc";

export const credentialsProvider = Credentials({
    credentials: {
        username: {},
        password: {},
    },

    async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
            return null;
        }

        try {
            const user = await trpcStandaloneClient.signIn.mutate({
                username: credentials.username,
                password: credentials.password,
                outsideReq: req,
            });
            return user;
        } catch (error) {
            return null;
        }
    },
});
