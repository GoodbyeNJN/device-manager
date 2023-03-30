import { signOut, useSession } from "next-auth/react";

export interface NavBarProps {
    setShowUserInfoModal: (show: boolean) => void;
    setShowDeviceModal: (show: boolean) => void;
}

export const NavBar: React.FC<NavBarProps> = props => {
    const { setShowUserInfoModal, setShowDeviceModal } = props;

    const { data: session } = useSession();

    return (
        <div className="navbar sticky top-0 z-10 bg-base-100 shadow-xl">
            <div className="flex-1">
                <a className="btn-ghost btn text-xl normal-case">设备管理</a>
            </div>
            <div className="flex-none">
                <a className="btn-ghost btn-circle btn" onClick={() => setShowDeviceModal(true)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </a>
                <div className="dropdown-end dropdown">
                    <a tabIndex={0} className="btn-ghost btn-circle avatar btn">
                        <div className="w-10 rounded-full">
                            <img
                                src={
                                    session?.user.avatar ||
                                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiI+PHBhdGggZmlsbD0iIzMzNjFjYyIgZD0iTTAgMGg5NnY5NkgweiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00MiAyNHYyMWE2IDYgMCAxIDAgMTIgMFYzMS4wM2ExOCAxOCAwIDEgMS0xOC43MiA0LjI1IDYgNiAwIDAgMC04LjUtOC41QTMwIDMwIDAgMSAwIDQ4IDE4YTYgNiAwIDAgMC02IDZ6Ii8+PC9zdmc+"
                                }
                            />
                        </div>
                    </a>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
                    >
                        <li>
                            <a onClick={() => setShowUserInfoModal(true)}>个人信息</a>
                        </li>
                        <li>
                            <a onClick={() => signOut()}>注销</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
