# Vardhan AI operations — free tier only

## Current state

The assistant is deployed on the `vardhan` Cloudflare Pages project. Its local knowledge answers work without inference. Production configuration now includes a dedicated Turnstile widget for `www.vardhan.pro`, the `AI` binding, and a private `AI_RATE_GUARD` service binding. The production variables enable the optional AI mode at the next build; verify a live challenged request before reporting real inference as working. The canonical host is `https://www.vardhan.pro`; apex redirects remain unchanged.

Knowledge-only chat works without Cloudflare bindings or API availability. It loads the panel and 44KB public index only after opening; the index is cached in memory for this tab, and questions/history remain in memory. Automatic AI requests send the current question and one short-lived token only. The server loads the same canonical generated index independently; callers cannot submit prompts, models, snippets, histories or URLs.

## Public content workflow

`knowledge/manifest.json` explicitly allowlists curated Markdown. `knowledge/generated/` is rebuilt from approved published portfolio/Lab records; drafts are not imported. Neither generated Markdown nor JSON is manually maintained or committed. `predev`/`prebuild` regenerate the corpus with Node+tsx. H2/H3 sections, including parent context, become stable IDs; code/HTML is stripped and long sections split at 300 words. Short self-contained sections remain short rather than being padded with unsupported facts. The corpus hash and generated snapshot timestamp are content-derived for reproducibility, not random build IDs. `postbuild` checks actual export paths/fragments.

Only public approved material is allowed. Before adding a manual Markdown file, review its facts/URL/status and add it to the manifest. README, drafts, dotfiles and unlisted files cannot be scanned incidentally. Metadata or private-pattern failures report a document ID, never the secret text. Curated synopses are intentionally short; do not maintain another full biography. Review synopsis accuracy when source wording changes; generated records update automatically.

## Local commands

- `npm run dev`: normal UI development and automatic index generation; no remote API is provided by Next static export.
- `npm run check`: formatter, lint, typecheck, build, postbuild source checks and all tests.
- `npm start`: existing built static preview, defaults loopback3000.
- `npm run start:ai-mock`: built static preview plus real handler in loopback-only deterministic mock mode, defaults3002. No Workers AI, Siteverify or quota is accessed. `/api/chat` returns `mode: knowledge`, never a fake AI answer.
- Direct mock request example: POST `http://127.0.0.1:3002/api/chat`, Origin same host, JSON `{"question":"What Kubernetes projects has Vardhan built?","turnstileToken":""}`.
- The browser defaults to knowledge-only, even on the mock server. Mock API is available for HTTP inspection/tests. Do not enable real Turnstile just to test deterministic fallback.

## Safety defaults and configuration

No actual credentials in the repository. `.dev.vars`, .env files, generated artifacts and Wrangler state are ignored. Use managed encrypted secrets only. No Cloudflare REST token belongs in the frontend.

| Name | Default / scope | Release requirement |
| --- | --- | --- |
| NEXT_PUBLIC_AI_WIDGET_ENABLED | visible unless false; build-time public | false hides launcher if needed |
| NEXT_PUBLIC_AI_ASSISTANT_ENABLED | false; build-time public | enable only after protected endpoint verified |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | absent; public build setting | dedicated portfolio widget, correct approved hosts |
| AI_MODE | off; server | workers only after tests/configuration; mock is loopback-only |
| AI_ASSISTANT_ENABLED | false; server | kill switch; true alone is insufficient |
| AI_FREE_TIER_CONFIRMED | false; server | confirm actual Workers Free subscription, not merely website zone plan |
| AI | absent; Pages binding | Workers AI binding on correct environment |
| ASSETS | Pages-provided | canonical index from same deployment |
| TURNSTILE_SECRET | absent; server secret | dedicated widget; never reuse unrelated account widget |
| AI_RATE_GUARD | absent; internal service binding | actual verified edge enforcement; absence fails closed |
| AI_ALLOWED_ORIGINS | https://www.vardhan.pro | exact same-origin allowlist; no wildcards |
| AI_MODEL | @cf/meta/llama-3.1-8b-instruct-fp8 | server allowlist; confirm catalog/plan before real use |
| AI_MAX_OUTPUT_TOKENS | 280 | integer1–280 |
| AI_TELEMETRY | false | optional category/mode/latency-only events, no transcript or IP |

The client automatically attempts AI for supported technical questions when production AI settings are present. Approved recruiter facts, broad overviews and unsupported topics use deterministic knowledge answers. Verification, network, quota or model failures retain the already-computed knowledge answer. A fresh Turnstile challenge is requested per remote send. Siteverify checks success, current host, `portfolio_chat` action and five-minute age. Cloudflare enforces token single use; tests simulate replay rejection. Origin checks are defense in depth, not authentication. No wildcard CORS. No retries or automatic paid fallback. Only one inference is possible for a valid request. HTTP payload cap4096bytes includes up to2048characters of Turnstile token plus the ≤500character question; requests exceeding the byte limit are rejected before JSON parsing. Evidence/prompt characters and output tokens are bounded, with a finite deadline. Upstream errors are sanitized.

## Free-tier infrastructure decision / release blocker

`AI_RATE_GUARD` is a Pages service binding to the deployed `vardhan-ai-rate-guard` Worker. Its source is `cloudflare/ai-rate-guard.ts` and deploy configuration is `cloudflare/wrangler.rate-guard.jsonc`. It has no public workers.dev endpoint or preview URL. Its rate-limit bindings allow 5 requests per minute per transient visitor key and 30 requests per minute across a Cloudflare location. Only requests with a valid Turnstile token consume the rate-limit allowance. Live 429 behavior still needs a controlled check.

Cloudflare documents one WAF rate-limit rule for a Free website zone. A verified zone-rule approach could be a smaller alternative; it needs an ADR/code adjustment and verified coverage, including preventing bypass through pages.dev hosts. Do not pretend an env flag, browser cooldown, in-memory Map or caller-provided header is rate-limit enforcement. Do not create a paid rate-limiting product or new storage. If compatible free enforcement cannot be confirmed, keep remote inference OFF and retain the useful knowledge-only assistant.

The internal service guard consumes additional Workers requests. The key is a transient SHA256 of day+visitor IP, never logged or persisted by this code; it is pseudonymous, not promised anonymous. The upstream HTTP client IP is obtained only at Cloudflare's edge, not accepted in the public JSON body. Rate-limit counters are approximate/location-local, not a strict global per-site billing cap. No claim is made that concurrency or a daily per-site neuron cap is enforced globally. Live enforcement remains unverified until an approved setup/smoke test.

## Cost policy

**Free tier only. Never enable Workers Paid, buy credits or switch to a paid provider.** The account's Workers subscription was confirmed as Workers Free in Cloudflare dashboard before setting `AI_FREE_TIER_CONFIRMED=true`. Recheck the subscription and pricing before changing the model or guard.

Cloudflare pricing currently provides10,000 shared account neurons/day, resets00:00UTC (05:30IST), and stops Free-plan inference on exhaustion. Functions share the Workers Free100,000requests/day pool; static paths bypass Functions and remain static. Index/BM25/local answers have no inference cost. Verify current terms and actual account usage at release.

The suggested fp8-fast model appears in public pricing but was absent from the exact catalog query. The regular fp8 8B model was returned by the account catalog and is the configured default. Its successful inference remains unverified. No Qwen switch or real-AI A/B benchmark occurred. The sample neuron estimator applies only to fp8-fast's documented 4,119 input / 34,868 output neurons per million tokens: 1,375 input + 200 output ≈ 12.64 neurons. This is an illustration, not measured usage or promised daily capacity, and must not be applied to the regular fp8 model. Real dashboard usage is authoritative.

## Telemetry and privacy

No raw questions, responses, exact IP addresses, user identities or user-agent fingerprints are logged or retained by application code. Optional server logs contain only outcome categories, mode and elapsed milliseconds. Browser data stays in this page's memory and clears on reload/clear. Existing Cloudflare analytics/settings were not changed. Cloudflare may process requests under its own terms; do not promise zero platform retention. There is no public health/binding endpoint.

## Release and verification sequence

1. Keep the Pages dashboard configuration as source of truth. The repo's Wrangler configuration applies only to the private rate-guard Worker; do not overwrite unrelated Pages settings.
2. Build and deploy through the existing Git integration. Only `/api/chat` should invoke a Function via `_routes.json`; static pages and knowledge JSON should remain static.
3. Check the live UI on `www.vardhan.pro`: automatic AI requests, Turnstile challenge, sourced answers and knowledge fallback. Check invalid tokens and rate-limit responses without repeated inference calls.
4. Monitor Workers AI usage and Functions volume. Free quota exhaustion must give local answers, not a plan upgrade.

## Kill switch and rollback

Set server AI_ASSISTANT_ENABLED=false (and/or AI_MODE=off) and redeploy the affected environment; the static widget continues knowledge-only. Turn off NEXT_PUBLIC_AI_ASSISTANT_ENABLED on rebuild to hide the optional remote control. To remove the widget entirely use NEXT_PUBLIC_AI_WIDGET_ENABLED=false and rebuild. Restore a verified previous Pages deployment if needed; do not change DNS or disable all account Workers. Previous deployed portfolio ID is recorded only in private local AGENTS, not in public operating docs.

## References checked during implementation

- [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Pages Function pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Rate-limit binding limitations](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Free-zone WAF availability](https://developers.cloudflare.com/waf/)

## Verification limitations

The Workers Free subscription was confirmed in the dashboard. Tests cover handler, guard, retrieval, export, and local mock behavior. A production AI response and actual quota consumption remain unverified until a successful live challenged request. Cloudflare rate-limit counters are location-local and approximate.
