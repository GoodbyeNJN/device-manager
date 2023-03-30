import { type SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/hooks";

import { Modal, type ModalProps } from "./modal";

interface Device {
    id: string;
    name: string;
    host: string;
    port: number;
}

export type CreateDeviceFormValues = Omit<Device, "id">;

export type ChangeDeviceFormValues = Pick<Device, "id"> &
    Partial<Omit<Device, "id" | "name">> & { name: string | null };

type DeviceItem = Omit<Device, "name"> & { name: string | null };

export interface DeviceListProps {
    devices?: DeviceItem[];
    isError: boolean;
    isLoading: boolean;
    onRefresh?: () => void;
}

export const CreateDeviceModal: React.FC<ModalProps> = props => {
    const { setShow, onClose } = props;

    const { register, handleSubmit } = useForm<CreateDeviceFormValues>();
    const { mutate, reset, isError, isLoading } = api.device.create.useMutation({
        onSuccess() {
            setShow(false);
            onClose?.();
        },
        onError() {
            setTimeout(reset, 2000);
        },
    });

    const onSubmit: SubmitHandler<CreateDeviceFormValues> = useCallback(
        values => {
            const { name, host, port } = values;

            const portNumber = Number(port);
            if (portNumber < 1 || portNumber > 65535) {
                return;
            }

            mutate({ name, host, port: portNumber });
        },
        [mutate],
    );

    return (
        <Modal {...props}>
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">设备名</span>
                    </label>
                    <input
                        className="input-bordered input"
                        placeholder="请输入设备名"
                        {...register("name")}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">地址</span>
                    </label>
                    <input
                        className="input-bordered input"
                        placeholder="请输入地址"
                        {...register("host")}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">端口</span>
                    </label>
                    <input
                        className="input-bordered input"
                        type="number"
                        placeholder="请输入端口"
                        {...register("port")}
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

export const ChangeDeviceModal: React.FC<ModalProps & ChangeDeviceFormValues> = props => {
    const { setShow, onClose, id, name, host, port } = props;

    const { register, handleSubmit } = useForm<ChangeDeviceFormValues>();
    const update = api.device.update.useMutation({
        onSuccess() {
            setShow(false);
            onClose?.();
        },
        onError() {
            setTimeout(update.reset, 2000);
        },
    });
    const remove = api.device.remove.useMutation({
        onSuccess() {
            setShow(false);
            onClose?.();
        },
        onError() {
            setTimeout(update.reset, 2000);
        },
    });

    const onSubmit: SubmitHandler<ChangeDeviceFormValues> = useCallback(
        values => {
            const { name, host, port } = values;

            const portNumber = Number(port);
            if (portNumber < 1 || portNumber > 65535) {
                return;
            }

            update.mutate({ id, name: name || undefined, host, port: portNumber });
        },
        [id, update],
    );

    return (
        <Modal {...props}>
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">设备id</span>
                    </label>
                    <input
                        className="input-bordered input"
                        defaultValue={id}
                        disabled
                        {...register("id")}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">设备名</span>
                    </label>
                    <input
                        className="input-bordered input"
                        placeholder="请输入设备名"
                        defaultValue={name || undefined}
                        {...register("name")}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">地址</span>
                    </label>
                    <input
                        className="input-bordered input"
                        placeholder="请输入地址"
                        defaultValue={host}
                        {...register("host")}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">端口</span>
                    </label>
                    <input
                        className="input-bordered input"
                        type="number"
                        placeholder="请输入端口"
                        defaultValue={port}
                        {...register("port")}
                    />
                </div>

                <div className="modal-action">
                    <button className="btn" type="button" onClick={() => setShow(false)}>
                        取消
                    </button>

                    {remove.isError ? (
                        <button className="btn-error btn">删除失败</button>
                    ) : (
                        <button
                            className={cx("btn-error btn", { loading: remove.isLoading })}
                            type="button"
                            onClick={() => remove.mutate({ id })}
                        >
                            删除
                        </button>
                    )}

                    {update.isError ? (
                        <button className="btn-error btn">保存失败</button>
                    ) : (
                        <button
                            className={cx("btn-primary btn", { loading: update.isLoading })}
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

export const DeviceList: React.FC<DeviceListProps> = props => {
    const { devices, isError, isLoading, onRefresh } = props;

    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [currentDevice, setCurrentDevice] = useState<DeviceItem>();
    const wake = api.device.wake.useMutation({
        onSuccess() {
            setTimeout(wake.reset, 2000);
        },
        onError() {
            setTimeout(wake.reset, 2000);
        },
    });

    const onEdit = useCallback((device: DeviceItem) => {
        setCurrentDevice(device);
        setShowDeviceModal(true);
    }, []);

    const onWake = useCallback(
        (device: DeviceItem) => {
            wake.mutate({ id: device.id });
        },
        [wake],
    );

    if (isError) {
        return (
            <div className="px-6">
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 flex-shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>获取设备列表失败</span>
                    </div>

                    <div className="flex-none">
                        <button className="btn-primary btn-sm btn" onClick={onRefresh}>
                            刷新
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="px-6">
                <h2>加载中</h2>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-wrap gap-6 p-6">
                {devices?.map(device => (
                    <div key={device.id} className="card card-compact w-64 bg-base-100 shadow-xl">
                        <figure>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-48"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                                />
                            </svg>
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title justify-center">
                                {device.name || `${device.host}:${device.port}`}
                            </h2>

                            <div className="card-actions justify-center">
                                <button className="btn" onClick={() => onEdit(device)}>
                                    修改
                                </button>

                                {wake.isError ? (
                                    <button className="btn-error btn">唤醒失败</button>
                                ) : (
                                    <button
                                        className={cx("btn-primary btn", {
                                            loading: wake.isLoading,
                                        })}
                                        onClick={() => onWake(device)}
                                    >
                                        唤醒
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ChangeDeviceModal
                show={showDeviceModal}
                setShow={setShowDeviceModal}
                onClose={onRefresh}
                {...(currentDevice || { id: "", name: null })}
            />
        </>
    );
};
