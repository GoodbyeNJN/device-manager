import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { api } from "@/hooks";

import type { SubmitHandler } from "react-hook-form";

export interface FormProps {}

export interface AuthFormValues {
    username: string;
    password: string;
}

export const SignInForm: React.FC<FormProps> = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm<AuthFormValues>();
    const { error, mutate, reset, isError, isPending } = api.signIn.useMutation({
        onSuccess() {
            router.replace("/");
        },
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
                    className="input input-bordered"
                    placeholder="请输入用户名"
                    {...register("username")}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">密码</span>
                </label>
                <input
                    className="input input-bordered"
                    type="password"
                    placeholder="请输入密码"
                    {...register("password")}
                />
            </div>

            <div className="form-control mt-6">
                {isError ? (
                    <button className="btn btn-error">{error.message}</button>
                ) : (
                    <button className={cx("btn btn-primary", { loading: isPending })} type="submit">
                        登录
                    </button>
                )}
            </div>
        </form>
    );
};

export const SignUpForm: React.FC<FormProps> = () => {
    const { register, handleSubmit } = useForm<AuthFormValues>();
    const { error, mutate, reset, isError, isPending } = api.signUp.useMutation({
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
                    className="input input-bordered"
                    placeholder="请输入用户名"
                    {...register("username")}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">密码</span>
                </label>
                <input
                    className="input input-bordered"
                    type="password"
                    placeholder="请输入密码"
                    {...register("password")}
                />
            </div>

            <div className="form-control mt-6">
                {isError ? (
                    <button className="btn btn-error">{error.message}</button>
                ) : (
                    <button className={cx("btn btn-primary", { loading: isPending })} type="submit">
                        注册
                    </button>
                )}
            </div>
        </form>
    );
};
