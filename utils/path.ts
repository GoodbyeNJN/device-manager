import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const resolveFileToAbsolute = (filepath: string) => path.resolve(__dirname, "..", filepath);
