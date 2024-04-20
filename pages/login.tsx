import Head from "next/head";

import { SignInForm, SignUpForm } from "@/components";

import type { NextPage } from "next";

const Login: NextPage = () => {
    return (
        <>
            <Head>
                <title>登录</title>
            </Head>

            <main className="hero min-h-screen bg-base-200">
                <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
                    <SignInForm />
                    {/* <SignUpForm /> */}
                </div>
            </main>
        </>
    );
};

export default Login;
