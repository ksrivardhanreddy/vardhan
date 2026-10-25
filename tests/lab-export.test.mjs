import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
const sitemap = readFileSync("out/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (m) => new URL(m[1]),
);
const slugs = urls
  .filter((u) => u.pathname.startsWith("/lab/"))
  .map((u) => u.pathname.split("/").pop());
const htmlFor = (pathname) =>
  readFileSync(
    pathname === "/" ? "out/index.html" : `out${pathname}.html`,
    "utf8",
  );
test("lab sitemap and static routes have six unique stories and exclude proposed experiments", () => {
  assert.equal(slugs.length, 6);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(
    readdirSync("out/lab").filter((f) => f.endsWith(".html")).length,
    6,
  );
  for (const slug of [
    "ai-platform-learning-track",
    "gitops-application-delivery",
    "private-service-inventory",
  ]) {
    assert.ok(!existsSync(`out/lab/${slug}.html`));
    assert.ok(!sitemap.includes(slug));
  }
  assert.ok(urls.some((u) => u.pathname === "/lab"));
});
test("every canonical page emits valid metadata, headings, links and safe new-tab attributes", () => {
  const titles = new Set();
  for (const url of urls) {
    const html = htmlFor(url.pathname);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, url.pathname);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert.ok(title);
    assert.ok(!titles.has(title));
    titles.add(title);
    assert.equal(
      new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]).href,
      url.href,
    );
    assert.match(html, /name="description"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card"/);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, href] of html.matchAll(/href="([^"?]+)"/g)) {
      if (href.startsWith("#")) {
        assert.ok(ids.includes(href.slice(1)), `${url.pathname}${href}`);
        continue;
      }
      if (!href.startsWith("/")) continue;
      const [file, hash] = href.split("#");
      assert.ok(
        file === "/" ||
          existsSync(path.join("out", file)) ||
          existsSync(path.join("out", `${file}.html`)),
        href,
      );
      if (hash) assert.ok(htmlFor(file).includes(`id="${hash}"`), href);
    }
    for (const [, attributes] of html.matchAll(
      /<a\b([^>]*target="_blank"[^>]*)>/g,
    ))
      assert.match(attributes, /rel="noopener noreferrer"/);
    if (url.pathname.startsWith("/lab/")) {
      const json = html.match(
        /<script type="application\/ld\+json">(.*?)<\/script>/s,
      );
      const data = JSON.parse(json[1]);
      assert.equal(data["@type"], "TechArticle");
      assert.equal(data.url, url.href);
      assert.equal(data.datePublished, undefined);
      assert.equal(data.dateModified, undefined);
      assert.match(html, /personal lab projects and learning notes/i);
    }
  }
});
test("lab preserves status boundaries, no invented evidence and JavaScript-free content", () => {
  const html = htmlFor("/lab");
  assert.match(html, /Learning tracks and planned experiments/);
  assert.match(
    html,
    /No working inference endpoint or GPU deployment is established/,
  );
  assert.match(html, /class="lab-filters" hidden=""/);
  for (const slug of slugs) assert.ok(html.includes(`/lab/${slug}`));
  const docker = htmlFor("/lab/docker-snap-apt-daemon-conflict");
  assert.match(docker, /Troubleshooting case study.*?Resolved/s);
  assert.match(docker, /Examples only/);
  assert.match(
    htmlFor("/lab/self-hosted-kubernetes-proxmox"),
    /Simplified conceptual diagram/,
  );
  for (const slug of slugs) {
    const article = htmlFor(`/lab/${slug}`);
    assert.doesNotMatch(article, /https:\/\/github.com\/\.\.\./);
    assert.doesNotMatch(
      article,
      /\b(?:10\.(?:\d{1,3}\.){2}\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/,
    );
    assert.doesNotMatch(
      article,
      /-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}/,
    );
  }
});
test("unpublished narrative is absent from all deployable HTML, text and browser scripts", () => {
  function files(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? files(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
  }
  for (const file of files("out").filter((file) =>
    /\.(html|txt|js|xml)$/.test(file),
  ))
    assert.ok(
      !readFileSync(file, "utf8").includes(
        "My Roadmap from Platform Engineering to AI Infrastructure",
      ),
      file,
    );
});
