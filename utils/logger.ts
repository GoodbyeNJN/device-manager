import chalk from "chalk";
import dayjs from "dayjs";

const colorize = (level: "info" | "warn" | "error") => {
    const map = {
        info: chalk.blue(level),
        warn: chalk.yellow(level),
        error: chalk.red(level),
        default: chalk.green(level),
    };

    const colorized = map[level] || map.default;

    return colorized;
};

const createLogger =
    (level: "info" | "warn" | "error") =>
    (...message: any[]) => {
        let date = "";
        if (message.length && dayjs.isDayjs(message[0])) {
            date = message.shift().format("YYYY-MM-DD HH:mm:ss");
        } else {
            date = dayjs().format("YYYY-MM-DD HH:mm:ss");
        }

        console.log(`[${date}] [${colorize(level)}]:`, ...message);
    };

export const logger = {
    info: createLogger("info"),
    warn: createLogger("warn"),
    error: createLogger("error"),
};
