import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
test("Pages Function bundles for the configured JavaScript target", async () => {
  // Uses the same bundler family as Wrangler; no remote bindings or inference.
  const result = await build({
    entryPoints: ["functions/api/chat.ts"],
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    tsconfig: "tsconfig.json",
  });
  assert.ok(result.outputFiles[0].text.includes("onRequest"));
  assert.doesNotMatch(result.outputFiles[0].text, /node:fs|node:crypto/);
  // Prove this smoke test catches the original Cloudflare packaging regression.
  await assert.rejects(
    build({
      entryPoints: ["functions/api/chat.ts"],
      bundle: true,
      write: false,
      format: "esm",
      platform: "browser",
      target: "es5",
      logLevel: "silent",
    }),
  );
});
