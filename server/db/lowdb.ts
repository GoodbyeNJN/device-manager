import fs from "node:fs";

import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";

import type { Adapter } from "lowdb";
import type { PathLike } from "node:fs";

const prepareFile = <T>(filepath: PathLike, data: T) => {
    const create = () => fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

    if (!fs.existsSync(filepath)) {
        create();
        return data;
    }

    const content = fs.readFileSync(filepath, "utf-8");
    if (!content) {
        create();
        return data;
    }

    try {
        return JSON.parse(content) as T;
    } catch (error) {
        create();
        return data;
    }
};

export class Db<T = unknown> {
    adapter: Adapter<T>;
    data: T;

    constructor(filepath: PathLike, data: T) {
        this.adapter = new JSONFile<T>(filepath);
        this.data = prepareFile(filepath, data);
    }

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
