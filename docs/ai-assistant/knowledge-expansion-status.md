# Knowledge expansion status

Work remains on `feature/portfolio-ai-assistant`. The earlier checkpoint was pushed to that branch at the owner's request; this update is intended for a feature-branch preview only, with no merge or production deployment. Production remains separate. Real Cloudflare inference is disabled and the design remains free-tier-only.

## Implemented

- 76 typed FAQ topics with 226 authored question variants, connected to the generated public index alongside the existing portfolio and Engineering Lab evidence.
- 144 indexed entries in the current build. Generated files remain ignored and are recreated by predev/prebuild.
- Public, owner-approved overall experience, availability, notice period, work arrangements, Hyderabad preference, international relocation and sponsorship requirements.
- Professional experience and projects, skills, education, credential status, personal lab architecture and troubleshooting, learning status, contact and appropriate missing-fact answers.
- Conservative exact/near-exact FAQ matching plus recruiter-topic routing; ambiguous matches fall through to the existing retrieval. Ordinary content retrieval is retained. FAQ facts are returned directly without an AI call.
- Career-break questions receive only the owner's approved generic contact response. Management scope, salary figures, technology-specific tenure and quantified outcomes are not invented. AI learning is explicitly separated from completed production work.
- API and retrieval regression tests, 19 held-out wording checks, all 226 authored variants, schema validation, privacy/adversarial checks and a local Function-bundling regression check.

## Preview build correction

The earlier feature preview failed after Next.js successfully exported the site: Wrangler's esbuild could not transform Function syntax to the root TypeScript target ES5. The target is now ES2022. A local esbuild test bundles the Function and also proves the original ES5 setting reproduces the failure. This is not a successful Cloudflare deployment: a new preview build still requires verification. The Cloudflare connector currently requests reconnection, so its build status cannot be confirmed through that connector.

## Remaining verification and owner decisions

- Review the public career statements and detailed FAQ wording, especially availability and sponsorship; update them when circumstances change.
- Conduct browser checks of the chat interface and keyboard/mobile behavior. This update verifies local HTTP and code behavior, not visual presentation.
- Measure a broader independent query set with real visitor-style questions. Passing authored fixtures or limited held-out wording does not establish 99% coverage of unseen questions.
- Real AI requires separately reviewed Cloudflare Free account confirmation, appropriate portfolio Turnstile configuration, AI and service bindings, rate guard and preview verification. No resources, paid services or inference were enabled by this change.
- The existing dependency audit findings are outside this content expansion. Reassess deliberately before a production release.

Public content is derived only from the approved portfolio, owner confirmations and published lab narratives. No private résumés, internal incidents, credentials, fabricated metrics, repositories or screenshots are ingested. The public README remains high level.
