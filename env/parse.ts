import { type z } from "zod";

import { isServerEnv } from "./common";
import { client, server } from "./schema";

const merged = server.merge(client);

export type Env = z.output<typeof merged>;
export type RawEnv = z.input<typeof merged>;

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 */
const safeGetEnv = (processEnv: NodeJS.ProcessEnv) => {
    const env: Record<string, string | undefined> = {};

    Object.keys(server.shape).forEach(key => {
        env[key] = processEnv[key];
    });

    Object.keys(client.shape).forEach(key => {
        env[key] = processEnv[key];
    });

    return env;
};

const parseEnv = (env: Partial<RawEnv>) => {
    const parsed = (
        isServerEnv ? merged.safeParse(env) : client.safeParse(env)
    ) as z.SafeParseReturnType<RawEnv, Env>;

    if (!parsed.success) {
        console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
        throw new Error("Invalid environment variables");
    }

    return parsed.data;
};

const wrapEnvWithProxy = (env: Env) => {
    return new Proxy<Env>(env, {
        get(target, prop) {
            if (typeof prop !== "string") {
                return undefined;
            }

            if (!isServerEnv && !prop.startsWith("NEXT_PUBLIC_")) {
                throw new Error(
                    `Attempted to access server-side environment variable '${prop}' on the client`,
                );
            }

            return target[prop as keyof Env];
        },
    });
};

export const env = process.env.SKIP_ENV_VALIDATION
    ? (process.env as Env)
    : wrapEnvWithProxy(parseEnv(safeGetEnv(process.env)));
