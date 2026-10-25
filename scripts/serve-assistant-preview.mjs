/** Local mock-only API + static preview. Never invokes Cloudflare or real AI. */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { handleChat } from "../lib/portfolio-ai/handler.ts";
const root = resolve("out");
const port = Number(process.env.PORT || 3002);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".xml": "application/xml",
};
createServer(async (req, res) => {
  const origin = `http://127.0.0.1:${port}`;
  try {
    if (new URL(req.url, origin).pathname === "/api/chat") {
      let length = 0;
      const chunks = [];
      for await (const data of req) {
        length += data.length;
        if (length > 4096) {
          res
            .writeHead(400, { "Content-Type": "application/json" })
            .end(JSON.stringify({ error: { code: "INVALID_REQUEST" } }));
          return;
        }
        chunks.push(data);
      }
      const request = new Request(origin + req.url, {
        method: req.method,
        headers: req.headers,
        ...(!["GET", "HEAD"].includes(req.method)
          ? { body: Buffer.concat(chunks) }
          : {}),
      });
      const response = await handleChat(request, {
        AI_MODE: "mock",
        AI_ASSISTANT_ENABLED: "true",
        AI_ALLOWED_ORIGINS: origin,
        ASSETS: {
          fetch: async () =>
            Response.json(
              JSON.parse(
                await readFile(
                  resolve(root, "knowledge-base/index.json"),
                  "utf8",
                ),
              ),
            ),
        },
      });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
      return;
    }
    let file = resolve(
      root,
      `.${decodeURIComponent(new URL(req.url, origin).pathname)}`,
    );
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if (file === root) file += "/index.html";
    else if (!extname(file)) file += ".html";
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(
    `Mock-only preview http://127.0.0.1:${port}. No inference or external verification.`,
  ),
);
