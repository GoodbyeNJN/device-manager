import { z } from "zod";

import { setTimeout } from "@/utils";

import {
    CHECK_COMMAND,
    CONNECT_COMMAND,
    CONNECT_STATUS,
    DISCONNECT_COMMAND,
    DISCONNECT_STATUS,
} from "../constants";
import { InternalServerError, NotFoundError } from "../error";
import { procedure } from "../procedures";
import { trpc } from "../trpc";
import { Socket } from "../utils";

import type { DeviceEntity } from "../db";

export const deviceRouter = trpc.router({
    list: procedure.protected
        .input(
            z.object({
                skip: z.number().optional(),
                take: z.number().optional(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { skip, take } = input;

            const devices = R.pipe(
                ctx.db.data.devices,
                R.filter(device => device.userId === ctx.user.id),
                R.drop(skip || 0),
                R.take(take || Infinity),
                R.map(({ id, name, host, port }) => ({ id, name, host, port })),
            );

            return devices;
        }),

    create: procedure.protected
        .input(
            z.object({
                name: z.string(),
                host: z.string(),
                port: z.number(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { name, host, port } = input;

            const device: DeviceEntity = {
                id: ctx.db.generateId(),
                name,
                host,
                port,
                userId: ctx.user.id,
            };

            await ctx.db.update(data => {
                data.devices.push(device);
            });

            const { userId: _userId, ...rest } = device;

            return rest;
        }),

    update: procedure.protected
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                host: z.string().optional(),
                port: z.number().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { id, name, host, port } = input;

            const indexed = R.pipe(
                ctx.db.data.devices,
                R.map.indexed((device, index) => ({ index, device })),
                R.find(({ device }) => device.id === id),
            );
            if (!indexed || indexed?.device.userId !== ctx.user.id) {
                throw new NotFoundError("设备不存在");
            }

            const data: Omit<typeof input, "id"> = {};
            if (name) {
                data.name = name;
            }
            if (host) {
                data.host = host;
            }
            if (port) {
                data.port = port;
            }

            const { index, device } = indexed;
            const updated = { ...device, ...data };
            await ctx.db.update(data => {
                data.devices[index] = updated;
            });

            const { userId: _userId, ...rest } = device;

            return rest;
        }),

    remove: procedure.protected
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { id } = input;

            const indexed = R.pipe(
                ctx.db.data.devices,
                R.map.indexed((device, index) => ({ index, device })),
                R.find(({ device }) => device.id === id),
            );
            if (!indexed || indexed?.device.userId !== ctx.user.id) {
                throw new NotFoundError("设备不存在");
            }

            const { index, device } = indexed;
            await ctx.db.update(data => {
                data.devices.splice(index, 1);
            });

            const { userId: _userId, ...rest } = device;

            return rest;
        }),

    wake: procedure.protected
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { id } = input;

            const device = R.pipe(
                ctx.db.data.devices,
                R.find(device => device.id === id),
            );
            if (!device || device.userId !== ctx.user.id) {
                throw new NotFoundError("设备不存在");
            }

            const { host, port } = device;

            const socket = new Socket();
            socket.setTimeout(1000);
            try {
                await socket.connect(host, port);

                await socket.write(CONNECT_COMMAND);

                // const connectResult = await socket.read();
                // if (connectResult?.toString("hex") !== CONNECT_STATUS.toString("hex")) {
                //     throw new Error("吸合失败");
                // }

                await setTimeout(300);
                await socket.write(DISCONNECT_COMMAND);

                // const disconnectResult = await socket.read();
                // if (disconnectResult?.toString("hex") !== DISCONNECT_STATUS.toString("hex")) {
                //     throw new Error("断开失败");
                // }
            } catch (error) {
                if (error instanceof Error) {
                    throw new InternalServerError(`唤醒设备失败: ${error.message}`, error.cause);
                } else {
                    throw new InternalServerError("唤醒设备失败", error);
                }
            } finally {
                await socket.write(DISCONNECT_COMMAND);
                await socket.end();
            }

            return "ok";
        }),

    check: procedure.protected
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { id } = input;

            const device = R.pipe(
                ctx.db.data.devices,
                R.find(device => device.id === id),
            );
            if (!device || device.userId !== ctx.user.id) {
                throw new NotFoundError("设备不存在");
            }

            const { host, port } = device;

            const socket = new Socket();
            socket.setTimeout(1000);
            try {
                await socket.connect(host, port);

                await socket.write(CHECK_COMMAND);

                await setTimeout(100);
                const checkResult = await socket.read();
                const status = checkResult?.toString("hex");

                if (status === CONNECT_STATUS.toString("hex")) {
                    return "connected";
                } else if (status === DISCONNECT_STATUS.toString("hex")) {
                    return "disconnected";
                } else {
                    throw new Error("未知状态");
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new InternalServerError(
                        `检查设备状态失败: ${error.message}`,
                        error.cause,
                    );
                } else {
                    throw new InternalServerError("检查设备状态失败", error);
                }
            } finally {
                await socket.end();
            }
        }),
});
