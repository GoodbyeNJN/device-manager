import { TRPCError } from "@trpc/server";

export class UnauthorizedError extends TRPCError {
    public constructor(message = "身份验证失败", cause?: unknown) {
        super({ code: "UNAUTHORIZED", message, cause });
    }
}

export class ForbiddenError extends TRPCError {
    public constructor(message = "无权访问该资源", cause?: unknown) {
        super({ code: "FORBIDDEN", message, cause });
    }
}

export class NotFoundError extends TRPCError {
    public constructor(message = "资源不存在", cause?: unknown) {
        super({ code: "NOT_FOUND", message, cause });
    }
}

export class InternalServerError extends TRPCError {
    public constructor(message = "服务器内部错误", cause?: unknown) {
        super({ code: "INTERNAL_SERVER_ERROR", message, cause });
    }
}
