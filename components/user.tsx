import { useSession } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/hooks";

import { Modal, type ModalProps } from "./modal";

export interface UserFormValues {
    username: string;
    nickname: string;
    password: string;
}

export const UserInfoModal: React.FC<ModalProps> = props => {
    const { setShow } = props;

    const { data: session } = useSession({ required: true });
    const { id, username, nickname } = session?.user || {};

    const { register, handleSubmit } = useForm<UserFormValues>();
    const { mutate, reset, isError, isLoading } = api.user.info.useMutation({
        onSuccess() {
            setShow(false);
        },
        onError() {
            setTimeout(reset, 2000);
        },
    });

    const onSubmit: SubmitHandler<UserFormValues> = useCallback(
        values => {
            const { nickname, password } = values;
            id && mutate({ id, nickname, password });
        },
        [id, mutate],
    );

    return (
        <Modal {...props}>
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">用户名</span>
                    </label>
                    <input
                        className="input-bordered input"
                        placeholder="请输入用户名"
                        defaultValue={username}
                        disabled
                        {...register("username")}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">昵称</span>
                    </label>
                    <input
                        className="input-bordered input"
                        placeholder="请输入昵称"
                        defaultValue={nickname || undefined}
                        {...register("nickname")}
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

                <div className="modal-action">
                    <button className="btn" type="button" onClick={() => setShow(false)}>
                        取消
                    </button>

                    {isError ? (
                        <button className="btn-error btn">保存失败</button>
                    ) : (
                        <button
                            className={cx("btn-primary btn", { loading: isLoading })}
                            type="submit"
                        >
                            保存
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
};
