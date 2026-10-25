/** Local-only static preview. Cloudflare response rules remain host-specific. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
const port = Number(process.env.PORT || 3000);
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if (file === root) file += "/index.html";
    else if (!extname(file)) file = file.replace(/\/$/, "") + ".html";
    if (!(await stat(file)).isFile()) throw new Error("Not a file");
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(req.method === "HEAD" ? undefined : await readFile(file));
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Static preview: http://127.0.0.1:${port}`),
);
