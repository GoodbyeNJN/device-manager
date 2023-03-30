import { type NextPage } from "next";
import Head from "next/head";

import { CreateDeviceModal, DeviceList, NavBar, UserInfoModal } from "@/components";
import { api } from "@/hooks";

export interface ModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

const Home: NextPage = () => {
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const { refetch, data, isError, isLoading } = api.device.list.useQuery(
        {},
        { refetchOnWindowFocus: false },
    );

    return (
        <>
            <Head>
                <title>设备管理</title>
            </Head>

            <main className="relative h-full w-full">
                <NavBar
                    setShowUserInfoModal={setShowUserInfoModal}
                    setShowDeviceModal={setShowDeviceModal}
                />

                <DeviceList
                    devices={data}
                    isError={isError}
                    isLoading={isLoading}
                    onRefresh={refetch}
                />
            </main>

            <UserInfoModal show={showUserInfoModal} setShow={setShowUserInfoModal} />

            <CreateDeviceModal
                show={showDeviceModal}
                setShow={setShowDeviceModal}
                onClose={refetch}
            />
        </>
    );
};

export default Home;
