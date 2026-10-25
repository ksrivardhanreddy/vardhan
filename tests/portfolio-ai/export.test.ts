import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("static export contains lazy launcher and narrow function routing without changing résumé policy", () => {
  const html = readFileSync("out/index.html", "utf8");
  assert.match(html, /Ask Vardhan AI/);
  assert.doesNotMatch(html, /id="ai-question"/);
  const routes = JSON.parse(readFileSync("out/_routes.json", "utf8"));
  assert.deepEqual(routes, { version: 1, include: ["/api/chat"], exclude: [] });
  assert.ok(
    readFileSync("out/knowledge-base/index.json", "utf8").includes(
      '"schemaVersion":1',
    ),
  );
  assert.match(
    readFileSync("out/_redirects", "utf8"),
    /SrivardhanReddy-Resume.pdf \/resume.pdf 301/,
  );
});
