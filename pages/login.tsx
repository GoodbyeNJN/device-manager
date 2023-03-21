import { type GetServerSideProps, type NextPage } from "next";
import { useRouter } from "next/router";
import { getCsrfToken, signIn } from "next-auth/react";

import { api } from "@/hooks";

export interface LoginProps {
    csrfToken: string | undefined;
}

interface FormElements extends HTMLFormControlsCollection {
    username: HTMLInputElement;
    password: HTMLInputElement;
    csrfToken: HTMLInputElement;
}
interface FormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

const SignInForm: React.FC<LoginProps> = props => {
    const { csrfToken } = props;

    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const router = useRouter();

    const onSignInError = useCallback(() => {
        setError(true);

        setTimeout(() => setError(false), 2000);
    }, []);

    const onSubmit = useCallback(
        (event: React.FormEvent<FormElement>) => {
            event.preventDefault();

            const { username, password, csrfToken } = event.currentTarget.elements;

            setLoading(true);
            signIn("credentials", {
                redirect: false,
                username: username.value,
                password: password.value,
                csrfToken: csrfToken.value,
            })
                .then(res => {
                    res?.ok ? router.replace("/") : onSignInError();
                })
                .catch(() => onSignInError())
                .finally(() => setLoading(false));
        },
        [router, onSignInError],
    );

    return (
        <form className="card-body" onSubmit={onSubmit}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">用户名</span>
                </label>
                <input
                    className="input-bordered input"
                    type="text"
                    name="username"
                    placeholder="请输入用户名"
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">密码</span>
                </label>
                <input
                    className="input-bordered input"
                    type="password"
                    name="password"
                    placeholder="请输入密码"
                />
            </div>

            <input type="hidden" name="csrfToken" value={csrfToken} />

            <div className="form-control mt-6">
                {isError ? (
                    <button className="btn-error btn">登录失败</button>
                ) : (
                    <button className={cx("btn-primary btn", { loading: isLoading })} type="submit">
                        登录
                    </button>
                )}
            </div>
        </form>
    );
};

const SignUpForm: React.FC<LoginProps> = props => {
    const { csrfToken } = props;

    const { mutate, reset, isError, isLoading } = api.signUp.useMutation({
        onError() {
            setTimeout(reset, 2000);
        },
    });

    const onSubmit = useCallback(
        (event: React.FormEvent<FormElement>) => {
            event.preventDefault();

            const { username, password } = event.currentTarget.elements;

            mutate({
                username: username.value,
                password: password.value,
            });
        },
        [mutate],
    );

    return (
        <form className="card-body" onSubmit={onSubmit}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">用户名</span>
                </label>
                <input
                    className="input-bordered input"
                    type="text"
                    name="username"
                    placeholder="请输入用户名"
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">密码</span>
                </label>
                <input
                    className="input-bordered input"
                    type="password"
                    name="password"
                    placeholder="请输入密码"
                />
            </div>

            <input type="hidden" name="csrfToken" value={csrfToken} />

            <div className="form-control mt-6">
                {isError ? (
                    <button className="btn-error btn">注册失败</button>
                ) : (
                    <button className={cx("btn-primary btn", { loading: isLoading })} type="submit">
                        注册
                    </button>
                )}
            </div>
        </form>
    );
};

const Login: NextPage<LoginProps> = props => {
    const { csrfToken } = props;

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
                <SignInForm csrfToken={csrfToken} />
                {/* <SignUpForm csrfToken={csrfToken} /> */}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<LoginProps> = async context => {
    const csrfToken = await getCsrfToken(context);

    return {
        props: { csrfToken },
    };
};

export default Login;
