import AutoImport from "unplugin-auto-import/webpack";
import { $, log } from "zx";

$.log = entry => entry.kind !== "cmd" && log(entry);
await $`npx tsx ./env`;

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
