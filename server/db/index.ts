import { DB_FILE } from "../constants";

import { Db } from "./lowdb";

export interface UserEntity {
    id: string;
    username: string;
    password: string;
}

export interface DeviceEntity {
    id: string;
    name: string;
    host: string;
    port: number;
    userId: string;
}

export interface Data {
    users: UserEntity[];
    devices: DeviceEntity[];
}

const data: Data = { users: [], devices: [] };

let cache: Db<Data>;

export const getDb = async () => {
    if (cache) return cache;

    if (!DB_FILE) {
        throw new Error("DB_FILE is not set. Please set it in .env file or environment variables.");
    }

    const db = new Db<Data>(DB_FILE, data);
    cache = db;

    return db;
};
