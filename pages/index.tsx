import Head from "next/head";

import { CreateDeviceModal, DeviceList, NavBar } from "@/components";
import { api } from "@/hooks";

import type { NextPage } from "next";

export interface ModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

const Home: NextPage = () => {
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
                <NavBar setShowDeviceModal={setShowDeviceModal} />

                <DeviceList
                    devices={data}
                    isError={isError}
                    isLoading={isLoading}
                    onRefresh={refetch}
                />
            </main>

            <CreateDeviceModal
                show={showDeviceModal}
                setShow={setShowDeviceModal}
                onClose={refetch}
            />
        </>
    );
};

export default Home;
