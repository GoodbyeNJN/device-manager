import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { getCsrfToken } from "next-auth/react";

import { SignInForm, SignUpForm } from "@/components";

export interface LoginProps {
    csrfToken: string | undefined;
}

const Login: NextPage<LoginProps> = props => {
    const { csrfToken } = props;

    return (
        <>
            <Head>
                <title>登录</title>
            </Head>

            <main className="hero min-h-screen bg-base-200">
                <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
                    <SignInForm csrfToken={csrfToken} />
                    {/* <SignUpForm csrfToken={csrfToken} /> */}
                </div>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<LoginProps> = async context => {
    const csrfToken = await getCsrfToken(context);

    return {
        props: { csrfToken },
    };
};

export default Login;
