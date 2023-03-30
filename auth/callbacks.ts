import { type CallbacksOptions } from "next-auth";

export const callbacks: Partial<CallbacksOptions> = {
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
};
