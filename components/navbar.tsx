import { useRouter } from "next/router";

import { api } from "@/hooks";
import { storage, writeClipboard } from "@/utils";

export interface NavBarProps {
    setShowDeviceModal: (show: boolean) => void;
}

export const NavBar: React.FC<NavBarProps> = props => {
    const { setShowDeviceModal } = props;

    const router = useRouter();
    const utils = api.useUtils();

    const [error, setError] = useState<Error>();
    const [success, setSuccess] = useState(false);

    const generateToken = async () => {
        let token = "";

        try {
            token = await utils.user.apiToken.fetch();
        } catch (error) {
            setError(new Error("生成 API 令牌失败"));
            return;
        }

        try {
            await writeClipboard(token);
        } catch (error) {
            setError(new Error("复制到剪贴板失败"));
            return;
        }

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    const signOut = () => {
        storage.remove("token");
        router.push("/login");
    };

    return (
        <div className="navbar sticky top-0 z-10 bg-base-100 shadow-xl">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl normal-case">设备管理</a>
            </div>
            <div className="flex-none gap-4">
                <button className="btn" onClick={() => setShowDeviceModal(true)}>
                    添加设备
                </button>

                {error ? (
                    <button className="btn btn-error">{error.message}</button>
                ) : success ? (
                    <button className="btn btn-success">已复制到剪贴板</button>
                ) : (
                    <button className="btn" onClick={generateToken}>
                        生成 API 令牌
                    </button>
                )}

                <button className="btn" onClick={signOut}>
                    注销
                </button>
            </div>
        </div>
    );
};
