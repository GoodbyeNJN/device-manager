import Unimport from "unimport/unplugin";
import webpack from "webpack";

const command = process.argv[2] || "dev";
const isProd = process.env.NODE_ENV === "production" || command === "build" || command === "start";
const isDev = process.env.NODE_ENV === "development" || command === "dev";

/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",

    eslint: {
        ignoreDuringBuilds: true,
    },

    typescript: {
        ignoreBuildErrors: true,
    },

    webpack: config => {
        config.plugins.push(
            Unimport.webpack({
                dts: "./types/auto-imports.d.ts",

                presets: ["react"],

                imports: [
                    { name: "default", as: "cx", from: "clsx" },
                    { name: "*", as: "R", from: "remeda" },
                ],
            }),
        );

        config.plugins.push(
            new webpack.DefinePlugin({
                "import.meta.env.DEV": isDev,
                "import.meta.env.PROD": isProd,
                "import.meta.env.SSR": `typeof window === "undefined"`,
            }),
        );

        config.infrastructureLogging = {
            level: "error",
        };

        return config;
    },
};

export default nextConfig;
