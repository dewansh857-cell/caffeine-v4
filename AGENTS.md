# Project Guidance

## User Preferences

See `../WORKING-PREFERENCES.md` for the full canonical working preferences (how Michael works). Key points:

- **Workflow:** develop locally, push with the Caffeine CLI; keep git updated.
- **Communication:** concise; end messages with a short summary + lettered options (a/b/c), one marked Recommended.
- **Operate:** flag refactors proactively; test against the draft URL below and report findings.
- **Publish:** if you can run the Caffeine CLI, publish the change yourself (`caffeine check --fix` then `caffeine preview --build`, using an absolute `--project` path) and notify me when the draft has updated — **always include the draft URL so I can click through and check it**; if you can't run the CLI, paste those commands for me to run.
- **Design system:** build on **shadcn/ui** (Radix + tokens) as the standard -- compose every page from shadcn components + design tokens; never hand-roll page markup with raw divs/ad-hoc Tailwind (importing a component here and there isn't enough; the page must be built from the system).
- **Page layout:** every page sits in one shared layout wrapper (owns padding, rhythm, centering) with width as a few named variants (narrow/default/wide/full); pages don't hardcode their own max-w-* or containers.
- **Source of truth:** `NORTH-STAR.md` = what this app is (direction); the build/status doc = status; audits/reviews are dated, disposable snapshots in `docs/`, never a competing source of truth.

**Draft URL (test target):** https://colossal-harlequin-urh-draft.caffeine.xyz

## Session handoff
_Read this first; update it last. One driver per app at a time — don't run another agent on this app while one is active._

**Last session:** 2026-06-22 — full review + fixed the data-identity cluster. Shipped draft #321.
- **What changed:** Full 4-way review → `docs/2026-06-22-full-review.md`. Then fixed the
  whole data-identity cluster (review #1–#5): extracted the canonical project seed into
  `lib/seedProjects.ts` (single source; `sampleProjects.ts` + store now both use it),
  renumbered hubs `sample-*`→`proj-*`, set `proj-2` maturity to `live`, pointed
  `LiveAppDetailPage` at real store projects via shared `deriveLiveApps`, and stopped
  `getProjectDetailData` returning proj-1's data for unknown ids (returns null + empty state).
  Typecheck + build green; deployed draft #321.
  Then dead-code sweep (#10): deleted 31 orphaned files (~8k LOC) — the `iterate/` and
  `organize/` dirs, the dead `components/LiveAppDetail.tsx` twin, the orphaned `manage/*Panel.tsx`,
  `OnboardingFlow`, `PublishToMarketInline`, unused Develop panels + shadcn ui primitives,
  duplicate `manage/AppCard` — plus cruft (`_tmp_23_*`, `index.css.bak`). Shipped draft #322.
  Kept `.old/` (mops check-stable baseline) and `manage/data.ts` (used by the live LiveAppDetail).
  Then design-token sweep #13 **part 1** (draft #323): replaced 205 arbitrary `text-[Npx]`
  classes with the existing font-size tokens (`text-2xs`/`xs-plus`/`sm-plus`). Safe, build-green.

  **NEW DIRECTION (Michael, 2026-06-23): shadcn/ui throughout** — now canonical in
  `../WORKING-PREFERENCES.md`. Build every page from shadcn components + tokens; never hand-roll
  page markup with raw divs/ad-hoc Tailwind. Decisions: **rebuild App\* ON shadcn** (keep API),
  first reference page = **Home/Dashboard**. Done so far (draft #324): added `ui/card.tsx` +
  `ui/badge.tsx` primitives; rebuilt `AppButton` (composes shadcn `buttonVariants`, accent via
  the consistent `--accent`, dropped grayed-disabled #14), `AppCard` (renders `<Card>`), `AppBadge`
  (composes `<Badge variant="bare">`); `ui/index.ts` exports Button/Card/Badge; rebuilt
  `ProfessionalHome` + the Personal/bento white tile on the system (colored bento tiles kept as an
  intentional pattern). The #13 color/hex cleanup now folds into each page rebuild (no separate pass).
- **Where I left off:** shadcn foundation in place + Home rebuilt as the reference. Live on draft #324.
- **Next step:** calibrate the Home reference with Michael, then migrate the rest page-by-page
  (Projects, Market, Live, Develop, Design…), folding in the raw palette/hex cleanup as each is
  rebuilt. **Token follow-up:** normalize `--primary` (defined as `--color-text` in some theme
  blocks, `--color-accent` in others) so shadcn `default` variants are consistent. Also still open:
  `CreatorProfilePage` double-`<h1>`; backend decision (#6).

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from `src/backend/`):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

[No learnings yet]
