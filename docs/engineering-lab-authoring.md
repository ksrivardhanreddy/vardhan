# Engineering Lab authoring

The Lab uses typed local content and static Next.js App Router pages. It needs no CMS, database, hosting upgrade or new runtime dependency. The personal Lab stays separate from professional Selected Work.

## Add a story

1. Copy `docs/templates/lab-article-template.md` into a private working note. Confirm the actual activity, status and safe scope with the owner.
2. Add a `LabArticle` object to `content/lab/articles.ts`. Types and status labels live in `content/lab/types.ts`. Use a unique lowercase hyphenated slug and unique section IDs. Add topics from the existing taxonomy, real technology tags, a problem, investigation/design decisions, tradeoffs, outcome/evidence limits, lessons and next steps.
3. Start with `published: false`. This controls inclusion in generated routes, homepage features, index and sitemap. Set it true only when the copy is ready for owner review; a build flag is not deployment approval. Keep private source notes outside public content entirely—GitHub source is public even when a route is excluded.
4. Use `featured: true` for selected homepage stories. Maintain three featured stories unless intentionally changing the design. Include related slugs only for published articles.
5. Evidence links are optional. Leave them absent when no real owner-approved repository or sanitized screenshot exists. Never insert placeholder links, invented output or measurements. Narrative articles are valid without fabricated artifacts.
6. Dates are optional. Add `publishedAt` only when first actually published, and `updatedAt` for subsequent actual edits. Do not use a build timestamp or the original spec date as a publication date. Reading time is calculated from the rendered article text at 200 words/minute.

## Planned and learning work

`content/lab/roadmap.ts` holds intentionally non-linked cards. AI serving, GPU hardware, personal GitOps and prototype ideas stay here until implementation is verified. All proposed milestones must read as planned. Professional familiarity is not evidence of a personal deployment. A learning checklist article is a plan, not proof of automation or completed restore drills.

## Accuracy and privacy gate

- State what happened historically, rather than promising current uptime.
- Only mark a troubleshooting story resolved when supplied evidence establishes the stated outcome. Configuration-state evidence alone does not prove long-term reliability.
- Strip addresses, MACs, node names, tailnet IDs, credentials, kubeconfigs, state files, internal domains, employer tickets and private architecture. Review screenshots manually before adding them.
- Keep commands illustrative and avoid invented exact outputs. Explain impact before recommending disruptive service/network changes.
- Use conceptual diagrams with an explicit caption. Avoid implying HA, cloud connectivity, public exposure or measured performance.
- Review titles, status, hardware, topology, technical conclusions and disclosure permission before any push. No automatic publication is authorized.

## Validate

Run `npm run check`: formatting, lint, TypeScript, static export and all export tests. `generateStaticParams` and `app/sitemap.ts` derive routes from published content. Test draft exclusion, metadata, links and status boundaries when adding new behavior.

Run `npm run dev` for interactive local routes. Use `npm start` to serve the export on loopback port 3000, with extensionless HTML fallback for `/lab` and article routes. Set `PORT=3001` if another preview is already running. The server does not emulate Cloudflare headers or redirects. Check mobile widths 360/390/768/1024/1440, both themes, keyboard filters, long headings, code scrolling, section anchors and résumé links. Test the JavaScript-disabled index: all stories should remain readable, while filter controls are hidden.

Before first launch, add actual publication dates only when appropriate and review the implementation report. Deployment and pushes require separate owner approval.
