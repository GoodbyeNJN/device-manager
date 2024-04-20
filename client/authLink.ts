import { observable } from "@trpc/server/observable";
import router from "next/router";

import { storage } from "@/utils";

import type { Router } from "@/server";
import type { TRPCLink } from "@trpc/client";

export const authLink: TRPCLink<Router> = () => options => {
    const { next, op } = options;

    return observable(observer =>
        next(op).subscribe({
            next(value) {
                observer.next(value);
                if (op.path === "signIn") {
                    const token = value.result.data;
                    token && storage.set("token", token);
                }
            },
            error(error) {
                observer.error(error);
                if (error.data?.code === "UNAUTHORIZED") {
                    router.push("/login");
                }
            },
            complete() {
                observer.complete();
            },
        }),
    );
};
