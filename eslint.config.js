import { withGoodbyeNJNConfig } from "eslint-config-goodbyenjn";

/** @type {import("eslint").Linter.Config} */
const config = [
    ...withGoodbyeNJNConfig({
        imports: {
            order: {
                warnOnUnassignedImports: false,
            },
        },
    }),
];

export default config;
