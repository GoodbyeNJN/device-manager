import { Socket } from "net";

import { PromiseDuplex } from "promise-duplex";

class Client<T extends Socket> extends PromiseDuplex<T> {
    private timeoutHandler: (() => void) | undefined;

    public constructor(public readonly socket: T = new Socket() as T) {
        super(socket);
    }

    public connect(host: string, port: number) {
        const socket = this.stream;

        return new Promise<void>((resolve, reject) => {
            if (this.readable._errored) {
                const error = this.readable._errored;
                this.readable._errored = undefined;
                reject(error);
            }

            if (this.writable._errored) {
                const error = this.writable._errored;
                this.writable._errored = undefined;
                reject(error);
            }

            const connectHandler = () => {
                socket.off("error", errorHandler);
                resolve();
            };

            const errorHandler = (error: Error) => {
                this.readable._errored = undefined;
                this.writable._errored = undefined;
                socket.off("connect", connectHandler);
                reject(error);
            };

            socket.once("error", errorHandler);
            socket.connect(port, host, connectHandler);
        });
    }

    public setTimeout(timeout: number) {
        const socket = this.stream;

        if (timeout && !this.timeoutHandler) {
            this.timeoutHandler = () => {
                this.timeoutHandler = undefined;
                socket.destroy(new Error("Timeout"));
            };
            socket.once("timeout", this.timeoutHandler);
        } else if (!timeout && this.timeoutHandler) {
            socket.off("timeout", this.timeoutHandler);
            this.timeoutHandler = undefined;
        }

        socket.setTimeout(timeout);
    }
}

export { Client as Socket };
