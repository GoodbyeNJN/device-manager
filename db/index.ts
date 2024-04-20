import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";

import type { Adapter } from "lowdb";
import type { PathLike } from "node:fs";

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

class Low<T = unknown> {
    constructor(
        public adapter: Adapter<T>,
        public data: T,
    ) {}

    async read() {
        const data = await this.adapter.read();
        if (data) {
            this.data = data;
        }
    }

    async write() {
        if (!this.data) {
            return;
        }

        await this.adapter.write(this.data);
    }

    async update(fn: (data: T) => unknown) {
        fn(this.data);
        await this.write();
    }

    generateId() {
        return nanoid(8);
    }
}

const JSONFilePreset = async <T>(filename: PathLike, defaultData: T) => {
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, JSON.stringify(defaultData, null, 4));
    }

    const adapter = new JSONFile<T>(filename);
    const db = new Low<T>(adapter, defaultData);
    await db.read();
    return db;
};

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const filepath = path.resolve(__dirname, "./data.json");
const data: Data = { users: [], devices: [] };

export const db = await JSONFilePreset<Data>(filepath, data);
