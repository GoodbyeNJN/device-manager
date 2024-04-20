import { trpcClient } from "@/client";

import type { AppType } from "next/app";

import "@/styles/globals.css";

const App: AppType = props => {
    const { Component, pageProps } = props;

    return <Component {...pageProps} />;
};

export default trpcClient.withTRPC(App);
