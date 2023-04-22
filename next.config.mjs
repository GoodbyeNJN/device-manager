import AutoImport from "unplugin-auto-import/webpack";
import { $, log } from "zx";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
if (!process.env.SKIP_ENV_VALIDATION) {
    $.log = entry => entry.kind !== "cmd" && log(entry);
    await $`npx tsx ./env`;
}

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",

    eslint: {
        ignoreDuringBuilds: true,
    },

    typescript: {
        ignoreBuildErrors: true,
    },

    webpack: config => {
        config.plugins.push(
            AutoImport({
                dts: "./types/auto-imports.d.ts",

                imports: [
                    "react",
                    { react: [["*", "React"]] },
                    { clsx: [["default", "cx"]] },
                    { "@/env": ["isServerEnv", "isDevEnv", "isProdEnv", "env"] },
                ],
            }),
        );

        return config;
    },
};

export default config;
