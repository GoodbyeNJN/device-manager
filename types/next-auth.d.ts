import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
        nickname: string | null;
        avatar: string | null;
    }

    interface Session extends DefaultSession {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        user: User;
    }
}
