import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
export function validateSourceLinks(index, root = process.cwd()) {
  for (const chunk of index.chunks) {
    if (!chunk.url.startsWith("/")) continue;
    const [pathname, fragment] = chunk.url.split("#");
    const target =
      pathname === "/"
        ? resolve(root, "out/index.html")
        : existsSync(resolve(root, "out", `.${pathname}`))
          ? resolve(root, `out${pathname}`)
          : resolve(root, `out${pathname}.html`);
    if (!existsSync(target))
      throw new Error(`Missing source target: ${chunk.id}`);
    if (fragment && !readFileSync(target, "utf8").includes(`id="${fragment}"`))
      throw new Error(`Missing source anchor: ${chunk.id}`);
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const index = JSON.parse(
    readFileSync("public/knowledge-base/index.json", "utf8"),
  );
  validateSourceLinks(index);
  console.log(
    `Knowledge link check: ${index.chunks.length} source targets passed.`,
  );
}
