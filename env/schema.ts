import { z } from "zod";

import { isProdEnv } from "./common";

export const server = z.object({
    DATABASE_URL: z.string().url(),

    NODE_ENV: z.enum(["production", "development", "test"]),

    NEXTAUTH_SECRET: isProdEnv ? z.string().min(1) : z.string().min(1).optional(),

    NEXTAUTH_URL: z.preprocess(
        // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
        // Since NextAuth.js automatically uses the VERCEL_URL if present.
        str => process.env.VERCEL_URL ?? str,
        // VERCEL_URL doesn't include `https` so it cant be validated as a URL
        process.env.VERCEL ? z.string().min(1) : z.string().url(),
    ),
});

/**
 * To expose environment variables to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const client = z.object({
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
});
