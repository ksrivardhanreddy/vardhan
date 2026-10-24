# Deployment and rollback

Cloudflare Pages project: `vardhan`
GitHub repository: `ksrivardhanreddy/vardhan`
Production branch: `main`
Custom domain: `www.vardhan.pro`

Static deployment settings:

- Build command: `npm run build`
- Output directory: `out`
- Root directory: repository root
- Build environment: Node.js 22
- No Pages Functions, database, or paid APIs required

## Previous website archive

The pre-redesign website is preserved at Git tag `archive/pre-redesign-2026-10-24`.
Original commit: `96b1eacd8a6424a5b77729b490b50a07a39f4e04`.
A local ZIP backup is stored in the ignored `archives/` directory.

Browse or download the archived site from the GitHub tag. It is not served as part of the new public website.

## Rollback

For an immediate rollback, use Cloudflare Pages to roll back to the previous successful production deployment (`09be47f8-e065-4db3-8296-ee6f96e8090c`).

For a durable source rollback, restore the archive tag's contents on a new branch and review before merging to `main`. The original adapter configuration was `npx @cloudflare/next-on-pages@1` with `.vercel/output/static`; use the build configuration appropriate to the version being restored.

Future pushes to `main` automatically deploy production. Preview branches deploy separately for review.
