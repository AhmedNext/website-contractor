import { readdir, copyFile } from "node:fs/promises";
import { resolve, join, relative, sep } from "node:path";
// Next 16.4's client requests dot-separated segment filenames, while the
// exporter writes some segments into nested __next.* directories.
// Supply matching static aliases. No redirects or runtime server are needed.
const root = resolve("out");
let count = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.name.endsWith(".txt")) continue;
    const parts = relative(root, path).split(sep),
      start = parts.findIndex((p) => p.startsWith("__next."));
    if (start < 0 || start === parts.length - 1) continue;
    const alias = join(
      root,
      ...parts.slice(0, start),
      parts.slice(start).join("."),
    );
    await copyFile(path, alias);
    count++;
  }
}
await walk(root);
console.log(`Static export ready: ${count} segment aliases created.`);
