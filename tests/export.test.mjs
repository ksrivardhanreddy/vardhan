import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
const html = readFileSync("out/index.html", "utf8");
const decode = (s) => s.replaceAll("&amp;", "&");
test("all homepage fragment links resolve to unique section IDs", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.includes(id), id);
});
test("local media, downloads and metadata images exist in the export", () => {
  for (const [, raw] of html.matchAll(
    /(?:src|href|content)="(\/[^"#?]+)(?:\?[^"#]*)?"/g,
  )) {
    const url = decode(raw);
    if (url === "/") continue;
    assert.ok(
      existsSync(path.join("out", url)) ||
        existsSync(path.join("out", `${url}.html`)),
      url,
    );
  }
  assert.ok(statSync("out/images/vardhan-portrait.webp").size < 200000);
});
test("one canonical current résumé, safe redirect and revalidation policy", () => {
  assert.match(html, /href="\/resume.pdf"[^>]*download/);
  assert.doesNotMatch(html, /href="\/SrivardhanReddy-Resume.pdf"/);
  assert.ok(!existsSync("out/SrivardhanReddy-Resume.pdf"));
  assert.match(
    readFileSync("out/_redirects", "utf8"),
    /^\/SrivardhanReddy-Resume.pdf \/resume.pdf 301/m,
  );
  assert.match(
    readFileSync("out/_headers", "utf8"),
    /max-age=0, must-revalidate/,
  );
  const pdf = readFileSync("out/resume.pdf", "latin1");
  assert.equal([...pdf.matchAll(/\/Type\s*\/Page\b/g)].length, 2);
});
test("semantic title, social metadata and structured data are emitted", () => {
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1);
  assert.match(html, /rel="canonical" href="https:\/\/www.vardhan.pro\/?"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/www.vardhan.pro\/opengraph-image.png"/,
  );
  const json = html.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s,
  );
  assert.equal(JSON.parse(json[1]).name, "Srivardhan Reddy Kolan");
});
test("public content preserves evidence boundaries and private drafts stay unpublished", () => {
  assert.match(html, /Previously earned · expired/);
  assert.match(html, /10\+ years of IT experience/);
  assert.match(html, /8\+ years in DevOps/);
  assert.match(html, /Completed evaluation/);
  assert.match(html, /Professional · public-safe/);
  assert.doesNotMatch(html, /ASUS NUC|vLLM/);
  assert.match(html, /Engineering obstacle/);
  for (const [, attrs] of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g))
    assert.match(attrs, /rel="noopener noreferrer"/);
});
