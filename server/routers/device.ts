import { z } from "zod";

import { InternalServerError, NotFoundError } from "@/server/error";
import { t } from "@/server/init";
import { protectedProcedure } from "@/server/procedure";
import { relayCommand } from "@/share/commands";
import { setTimeout, Socket } from "@/utils";

export const deviceRouter = t.router({
    list: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                skip: z.number().optional(),
                take: z.number().optional(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { id, skip, take } = input;

            const devices = await ctx.prisma.device.findMany({
                where: { id, userId: ctx.session.user.id },
                skip,
                take,
            });

            return devices;
        }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                host: z.string(),
                port: z.number(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { name, host, port } = input;

            const device = await ctx.prisma.device.create({
                data: { name, host, port, userId: ctx.session.user.id },
            });

            return device;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                host: z.string().optional(),
                port: z.number().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            console.log("input:", input);
            const { id, name, host, port } = input;

            const device = await ctx.prisma.device.findUnique({
                where: { id },
            });
            if (!device || device.userId !== ctx.session.user.id) {
                throw new NotFoundError("设备不存在");
            }

            const updatedDevice = await ctx.prisma.device.update({
                where: { id },
                data: { name, host, port },
            });

            return updatedDevice;
        }),

    remove: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { id } = input;

            const device = await ctx.prisma.device.findUnique({
                where: { id },
            });
            if (!device || device.userId !== ctx.session.user.id) {
                throw new NotFoundError("设备不存在");
            }

            const removedDevice = await ctx.prisma.device.delete({
                where: { id },
            });

            return removedDevice;
        }),

    wake: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { id } = input;

            const device = await ctx.prisma.device.findUnique({
                where: { id },
            });
            if (!device || device.userId !== ctx.session.user.id) {
                throw new NotFoundError("设备不存在");
            }

            const socket = new Socket();
            socket.setTimeout(1000);
            try {
                await socket.connect(device.host, device.port);

                await socket.write(relayCommand.connect);
                // await socket.read();

                await setTimeout(300);

                await socket.write(relayCommand.disconnect);
                // await socket.read();
            } catch (error) {
                if (error instanceof Error) {
                    throw new InternalServerError(`唤醒设备失: ${error.message}`, error.cause);
                } else {
                    throw new InternalServerError("唤醒设备失败", error);
                }
            } finally {
                await socket.write(relayCommand.disconnect);
                // await socket.read();

                await socket.end();
            }

            return "ok";
        }),
});
