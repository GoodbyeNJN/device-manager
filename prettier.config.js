import prettier from "eslint-config-goodbyenjn/prettier";

/** @type {import("prettier").Config} */
const config = {
    ...prettier,
    plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
