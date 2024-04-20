import { procedure } from "../procedures";
import { trpc } from "../trpc";

export const pingRouter = trpc.router({
    ping: procedure.public.query(() => "pong"),
});
