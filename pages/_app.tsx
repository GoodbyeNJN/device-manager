import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpcNextClient } from "@/share/trpc";
import "@/styles/globals.css";

export interface AppProps {
    session?: Session | null;
}

const App: AppType<AppProps> = props => {
    const {
        Component,
        pageProps: { session, ...pageProps },
    } = props;

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
};

export default trpcNextClient.withTRPC(App);
