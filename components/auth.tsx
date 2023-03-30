import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/hooks";

export interface FormProps {
    csrfToken: string | undefined;
}

export interface AuthFormValues {
    username: string;
    password: string;
    csrfToken: string;
}

export const SignInForm: React.FC<FormProps> = props => {
    const { csrfToken } = props;

    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const { register, handleSubmit } = useForm<AuthFormValues>();
    const router = useRouter();

    const onSignInError = useCallback(() => {
        setError(true);
        setTimeout(() => setError(false), 2000);
    }, []);

    const onSubmit: SubmitHandler<AuthFormValues> = useCallback(
        values => {
            const { username, password, csrfToken } = values;

            setLoading(true);
            signIn("credentials", { redirect: false, username, password, csrfToken })
                .then(res => {
                    res?.ok ? router.replace("/") : onSignInError();
                })
                .catch(() => onSignInError())
                .finally(() => setLoading(false));
        },
        [router, onSignInError],
    );

    return (
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">用户名</span>
                </label>
                <input
                    className="input-bordered input"
                    placeholder="请输入用户名"
                    {...register("username")}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">密码</span>
                </label>
                <input
                    className="input-bordered input"
                    type="password"
                    placeholder="请输入密码"
                    {...register("password")}
                />
            </div>

            <input type="hidden" defaultValue={csrfToken} {...register("csrfToken")} />

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

export const SignUpForm: React.FC<FormProps> = props => {
    const { csrfToken } = props;

    const { register, handleSubmit } = useForm<AuthFormValues>();
    const { mutate, reset, isError, isLoading } = api.signUp.useMutation({
        onError() {
            setTimeout(reset, 2000);
        },
    });

    const onSubmit: SubmitHandler<AuthFormValues> = useCallback(
        values => {
            const { username, password } = values;
            mutate({ username, password });
        },
        [mutate],
    );

    return (
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">用户名</span>
                </label>
                <input
                    className="input-bordered input"
                    placeholder="请输入用户名"
                    {...register("username")}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">密码</span>
                </label>
                <input
                    className="input-bordered input"
                    type="password"
                    placeholder="请输入密码"
                    {...register("password")}
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
