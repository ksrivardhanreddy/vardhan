# Vardhan AI implementation plan / ADR

## Audited architecture

25 October 2026: Next.js15 App Router, React18, TypeScript, Tailwind, npm, static export `out`, Cloudflare Pages project `vardhan`, GitHub repository `ksrivardhanreddy/vardhan`, production branch main. Canonical host www.vardhan.pro; existing apex redirects. There are no Functions, Wrangler source-of-truth files or AI bindings. Production and preview variable names contain NODE_VERSION only. No portfolio Turnstile widget exists; the account's unrelated widget will not be reused. Zone inspection shows no HTTP rate-limit ruleset. All inspection was read-only. The existing production deployment was inspected and left unchanged.

## Decision

Keep Next static export. Add a narrowly routed Pages Function at `functions/api/chat.ts`; no Next server adapter, new host, DNS change, database or vector index. The widget lives in the shared root layout and loads its panel/index on demand. Curated public Markdown in knowledge is the factual retrieval source; published Lab records are converted automatically into generated Markdown. Shared pure BM25/extraction modules serve browser and edge. Postbuild validation checks every index URL/fragment against actual exported HTML. One generated index is fetched through Pages ASSETS at the edge.

The deployment remains dashboard-managed; do not introduce an authoritative Wrangler file for Pages. Functions route artifact includes only /api/chat. Real inference defaults off. Preview/binding creation, Turnstile resources, provider calls, push, merge and deployment are NOT authorized this turn.

## Rate-limiting decision

Pages documents AI and service bindings, but does not list the Workers rate-limit binding as supported. Do not pretend an in-memory map or an unverified Pages binding is distributed enforcement. Implement a fail-closed Pages service-binding guard protocol, with an optional internal Worker using Cloudflare's real rate-limit API. This Worker is not on the portfolio hostname and has workers.dev disabled in the example configuration. It is proposed infrastructure only; not created. Without the guard binding, inference returns unavailable. Owner may choose a verified zone WAF alternative after review, but this code does not trust caller headers asserting a WAF pass. Real rate-limit enforcement in Cloudflare remains a release blocker until approved setup and test.

## Exact additive paths

- knowledge/*.md + manifest.json; generated Lab Markdown excluded from manual editing
- scripts/build-knowledge-index.mjs, scripts/validate-knowledge-links.mjs
- lib/portfolio-ai/{types,search,extractive-answer,privacy,prompt,handler,usage}.ts
- components/portfolio-ai/{AiAssistant,AiChatPanel,turnstile}.tsx/ts and scoped styles
- functions/api/chat.ts; public/_routes.json
- cloudflare/ai-rate-guard.ts plus example config only
- tests/portfolio-ai and docs/ai-assistant
- Modify app/layout.tsx, build/test/lint/format scripts and local preview server; preserve all current pages, résumé, headers and professional content.

## Stages and verification

A: complete specification read; clean checkout branched feature/portfolio-ai-assistant; public source mapping and corpus curated. No infrastructure mutation.
B: build parsing/chunking, hashed version, validation, BM25 aliases/coverage/abstention and deterministic extraction; add actual published Lab content automatically.
C: lazy widget, privacy note, sources, local search, focus trap/restore, mobile layout and fallback.
D: strict bounded JSON, same-origin allowlist, independent canonical retrieval, mandatory Siteverify, fail-closed guard, allowlisted model, finite budgets, no retries, aggregate-only telemetry.
E: mocked endpoint tests, at least20question evaluation, static build/link checks and browser review. Real inference benchmarking and edge preview require later owner approval/configuration.

## Model/cost reconnaissance

Cloudflare pricing currently lists the suggested Llama8B model and10,000 daily free account neurons; the model catalog query did not return that exact ID. A broader first-page catalog response included Qwen3-30B. No inference was attempted; account-specific Llama availability and quota are NOT confirmed. Keep the suggested model allowlisted but disabled until confirmed; do not silently switch models or billing. Current references and release gates are recorded in operations.md.

## Actual completed stages / remaining gates

A–D implementation is present and passes mocked tests. Current corpus:21documents/68chunks from current approved public content. Curation/index stages produce content-hashed JSON and validate every URL after export. Chat is lazy, uses local extraction first, caps history, uses text-only rendering, and provides optional protected inference only behind configuration. The Pages adapter and internal rate-guard implementation are code only; no resource was created.

The owner additionally requires Cloudflare Free only. Enforce AI_FREE_TIER_CONFIRMED and fail closed if it is absent. Read-only billing-subscription inspection returned403 because the OAuth connection cannot read Billing; do not broaden credentials or claim the Workers plan is confirmed from the website zone's Free plan. The regular Llama3.1fp8 model was returned by a subsequent catalog query; fp8-fast remains unconfirmed in that catalog. Neither has been invoked.

E: full formatting/lint/types/staticbuild/postbuild/tests pass.25mock evaluation questions:17/17positive top3document recall and8/8correct abstentions on this curated fixture set, zero false positives there. This is a regression set, not a claim of universal accuracy. No real inference latency/neuron usage benchmark or providerA/B test was run.

Browser automation became unavailable and timed out, including its native Chrome fallback. Do not claim responsive, visual or keyboard behavior was manually verified in a browser during this task. Local HTTP preview and mock API work; owner can review at loopback3002. Full real-browser/mobile and real edge verification are outstanding. No preview deployment is authorized/performed.
