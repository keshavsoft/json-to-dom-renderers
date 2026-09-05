import { defineConfig } from "vite";
import { readdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const latestSrcVersion = readdirSync(resolve(__dirname, "src"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^v\d+$/.test(entry.name))
    .map((entry) => ({ name: entry.name, n: Number(entry.name.slice(1)) }))
    .sort((a, b) => b.n - a.n)[0]?.name;

if (!latestSrcVersion) {
    throw new Error("No src/vN folders found");
}

const entryFile = existsSync(resolve(__dirname, "src", latestSrcVersion, "index.js"))
    ? resolve(__dirname, "src", latestSrcVersion, "index.js")
    : resolve(__dirname, "src", latestSrcVersion, "build/buildSpecElement.js");

export default defineConfig({
    server: {
        fs: {
            allow: [".."]
        }
    },
    build: {
        outDir: resolve(__dirname, "docs/dist", latestSrcVersion),
        emptyOutDir: false,
        minify: true,
        lib: {
            entry: entryFile,
            name: "jsonToDomRenderers",
            formats: ["es"],
            fileName: () => "min.js"
        }
    }
});
