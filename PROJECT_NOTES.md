# Caffeine Designer — Project Notes

> Read this first. It's the get-up-to-speed brief for anyone (human or a fresh
> Claude account) picking up this project. Last updated: 2026-06-22.

## What this app is

**Caffeine Designer** is a tool for designing app specs and (currently simulated)
building/deploying apps on **Caffeine** — a platform that hosts full-stack apps on
the **Internet Computer (IC)**. A user answers a friendly questionnaire about the
app they want, and the tool produces a real, buildable spec + an ordered build plan
they can paste into Caffeine.

- Caffeine project id: `019dabc7-f15e-714a-b699-c96dbe4cf536`
- Caffeine project name: `Caffeine Designer`

## How it's built

Monorepo managed with **pnpm**.

- **Frontend** — `src/frontend/` — React 18 + TypeScript + Tailwind + TanStack
  Router + Zustand (state persisted to `localStorage`).
- **Backend** — `src/backend/` — Motoko (runs on the IC). **Important:** the app
  is currently **fully simulated** — it makes **zero** backend calls and stores
  everything in `localStorage` via a `localFallback` layer. Wiring the real
  Motoko backend is still pending.
- **Hosting/deploy** — via the **Caffeine CLI** (`caffeine preview --build`).
  There is no `caffeine publish` from the CLI; real publishing is done from the
  Caffeine web dashboard.

### Design system

- All colours are **OKLCH tokens** in `src/frontend/src/index.css`.
- `data-theme` is forced to `"studio"`; there's an independent light/dark toggle.
- **Bento supporting palette** added: `--bento-mint / sky / lilac / gold / coral`
  (each with `-fg` ink and `-soft` tint), plus `.bento-*` utility classes.
- **Two builder skins**, switched by `data-skin` on `<html>` (set in `App.tsx`):
  - `personal` → warm **orange** (default). For casual/non-technical builders.
  - `professional` → calm **indigo**. For people building for work/their company.
  - The skin is meant to follow a future **space/workspace** context. A
    lightweight **Personal/Work switch** now sits at the top of Home (backed by
    `activeSkin` in the store) — the seed of that space concept. "Personal vs
    Professional" = who's *doing the building*, not who the app is for.

### Key files

- `src/frontend/src/pages/DesignPage.tsx` — the spec questionnaire (the live flow;
  `STEPS` array) + the review screen.
- `src/frontend/src/lib/specEngine.ts` — **the spec brain**. Pure TS. Synthesises a
  structured spec, runs a dependency + conflict pass, generates a 7-phase build
  plan with copy-paste prompts, and audits the result. Replaces the old flat
  markdown dump. Also folds in the deeper "Specifics" from the branching questions.
- `src/frontend/src/lib/specQuestions.ts` — **the question engine**. Domain
  inference (ecommerce/social/content/dashboard/booking/productivity/saas),
  per-domain question modules, branch rules (payment model → tiers, messaging
  scope, notifications, search…), and `augmentQuestions(base, answers)` which
  inserts them dynamically. DesignPage walks this computed list, not a fixed array.
- `src/frontend/src/pages/DashboardPage.tsx` — Home. Now a **skin switcher**:
  renders `PersonalHome` (bento) or `ProfessionalHome` based on `activeSkin`,
  with a Personal/Work toggle at the top.
- `src/frontend/src/components/home/ProfessionalHome.tsx` — the calm indigo
  workspace view (KPI strip + dense apps table; colour only on status dots).
- `src/frontend/src/store/useAppStore.ts` — Zustand store. Holds `activeSkin`
  (`personal` | `professional`) + `setSkin`; persisted to localStorage.
- `src/frontend/src/components/ui/ListRow.tsx` — shared list-row primitive.
- `src/frontend/src/components/Develop/DecisionPanel.tsx` — develop-mode "fix"
  prompts; prompts are now prefixed with the app name.
- `src/frontend/src/index.css` — all design tokens + skins.

## Where things stand

Done:
- Cleanup: retired the Classic theme, unified the accent, shared list primitive.
- Bento design system + two skins (personal/professional) locked in code.
- Personal Home rebuilt in the bento system on real data.
- **Professional workspace view** (calm indigo, KPI strip + dense apps table) +
  a Personal/Work skin switch on Home, backed by `activeSkin` in the store.
- **Spec engine** built and wired into the review screen (Spec / Build plan /
  Checks tabs, per-phase copy buttons, richer markdown export).
- **Refactor pass** — extracted `lib/format.ts` (`timeAgo`, `formatDate`),
  replacing 6 copy-pasted date helpers across the pages; deleted the dead,
  duplicate `Domain`/`inferDomain` from `specEngine.ts` (canonical lives in
  `specQuestions.ts`).
- **Unified app data (P1)** — Projects and Live now read from the store (via
  `useProjects`) like Home, instead of their own mock arrays. All three screens
  agree on which apps exist; Live derives its rows from genuinely-live projects
  (no more phantom "Meridian Analytics" / "Nexus Chat").
- **Domain-aware branching questions** (`specQuestions.ts`) — the interview now
  adapts: after it infers the domain it injects tailored questions and follow-ups,
  and the engine renders a "Specifics" section + richer build prompts from them.
  11 domains (incl. marketplace/events/education/health), a "Category" router
  question for ambiguous cases, and removal rules that drop irrelevant base
  questions (e.g. API tools skip look/nav; personal tools skip scale).
- App name added to develop-mode fix prompts and the build-plan prompts.
- Ongoing "calmer / minimal" pass (reduce stacked panels):
  - Project detail header trimmed — one primary action + a "⋯" overflow menu,
    empty metadata hidden, secondary verified badge removed.
  - Spec review screen — dropped the duplicate "Your choices" side panel (the
    Spec tab already lists every choice) and collapsed its four buttons to one
    primary ("Copy full spec") + Export + a "⋯" menu (Review/Analyze with AI).
  - Focused build mode — the global nav is hidden while the build questionnaire
    is running (one header instead of two); it returns on exit. (`AppShell.tsx`
    reads `designFlowActive`.)
  - Still to do: slim the project Overview body, soften nested card borders.

### Reality-check (2026-06-22 full review — see `docs/2026-06-22-full-review.md`)

A full 4-way review found that several items marked "Done" above are only **half**
done — the project is carrying finished-looking but incomplete work:

- **"P1 — all three screens agree on which apps exist" is NOT true.** Three seed
  sources disagree on identity: the store seeds `proj-1..6`, `sampleProjects.ts`
  seeds `sample-1..6` (different data), and the seeded hubs reference `sample-*`
  ids that don't exist. `SAMPLE_PROJECTS` is dead at runtime (store always
  rehydrates `proj-*`). → being fixed now (unify seed + id scheme).
- **"Live — no more phantom apps" only half-holds.** `LivePage` derives real rows,
  but `LiveAppDetailPage` still falls back to a phantom mock (`LIVE_APPS[0]`) on
  every click, so every live-app detail shows the same wrong app.
- **`getProjectDetailData` silently returns proj-1's data** for any id outside
  `proj-1..6` — every user-created project shows ClearPath Practice's details.
- **`proj-2` is both `live` and `building`** — confirmed root cause of the
  "Community Hub appears twice" bug listed under Pending.
- **A second refactor was started and abandoned:** `manage/LiveAppDetail.tsx`
  (1635 lines) was decomposed into `manage/*Panel.tsx`, but the panels are
  orphaned and the monolith is still what's wired in. ~30 dead files total.
- **The Motoko backend is dead AND drifted** (~15 fields out of sync; no access
  control). Still localStorage-only.

Pending / next (roughly prioritised):
- **Rebalance the Personal Home** — the bento leaves an empty gap on wide screens,
  and "Community Hub" appears twice (a Live tile *and* the gold "pick up where you
  left off" nudge) because its seed data is both `deploymentStatus: live` and
  `metadata.maturity: building`. Dedupe + fill the grid.
- **Personal/Work space onboarding** — turn the skin toggle into a real space you
  land in (an onboarding question + a space concept), not just a switch.
- **Calmer pass leftovers** — slim the project Overview body; soften nested card
  borders globally.
- Smaller polish — unify the status vocabulary (Home/Projects say Live/Building/
  Draft; Live says Running/Degraded/Offline); calm the Market card gradients to
  match the bento palette.
- **The big one — wire the real Motoko backend** so the app stops being a
  localStorage simulation (one true source of truth; real data ownership).

## Known issues & tricky bits (read before deploying)

- **Deploy: COMMIT FIRST.** The deploy box chains steps with `&&`; if any step
  fails the chain aborts and uncommitted work is lost (this bit us twice). The
  reliable pattern is to commit before building and not let `check` gate the
  build:
  `… && git add -A && git commit … && caffeine check --fix … ; caffeine preview --build …`
- **Linter gotchas (biome 1.9.4).** Import-sort shows as an *error* in plain
  `biome check` but is auto-fixed by `caffeine check --fix` (safe). The ones that
  actually halt the chain are *unsafe* fixes: `useTemplate` (string `+`
  concatenation) and `noUnusedTemplateLiteral` (bare backtick strings). Avoid
  both — use template literals or the `join()` helper in `specEngine.ts`.
- **It's all simulated.** Every project/answer/setting is mock data in
  `localStorage` (`localFallback` + the seed array in `useAppStore.ts` +
  `lib/sampleProjects.ts`). P1 pointed all screens at the store, but it's still
  fake until the backend is wired.
- **After deploying, hard-refresh the draft** (Cmd+Shift+R) — the browser caches
  the old bundle. Draft URL is stable (`colossal-harlequin-urh-draft.caffeine.xyz`);
  during upload it briefly shows "Draft App Expired".
- **Focused build mode** hides the global nav via `AppShell` reading
  `designFlowActive`; every exit path calls `endDesignFlow`, so the nav always
  returns. If you add a new exit, call `endDesignFlow`.
- **Local verification (assistant side).** tsc is run by copying `src` to a local
  temp (mount reads are flaky); biome needs the `@biomejs/cli-linux-arm64` binary.
  The user runs the real `caffeine` build/deploy.

## How we work (the loop)

- Code is edited **locally on the Mac** (in this folder). A sandboxed assistant
  makes edits and typechecks them, but **cannot** run the real `vite build` (a
  macOS/Linux native-binary mismatch) or authenticate the Caffeine CLI.
- So: assistant edits + typechecks → **the user runs** `caffeine preview --build`
  to build/deploy, and reports back.
- Typecheck locally with: `cd src/frontend && pnpm typecheck`.

## Git & deploy workflow

- This project uses a **local-only git repo** inside this folder
  (`~/Desktop/caffeine-apps/caffeine-designer/.git`). No GitHub, no remote.
- `.gitignore` already excludes `node_modules/`, `dist/`, `.mops/`, etc.
- Standard "ship it" step (the user runs it; the assistant can't): one combined
  box that builds + deploys to Caffeine and commits to local git —
  `cd ~/Desktop/caffeine-apps/caffeine-designer && caffeine preview --build && git add -A && git commit -m "…"`
- **Keep this notes file current** as the project changes — it travels with the
  repo so any other Claude account can get up to speed instantly.

## Verified commands

See `AGENTS.md`. In short, from `src/frontend/`: `pnpm install --prefer-offline`,
`pnpm typecheck`, `pnpm fix`, `pnpm build`. Deploy from the project root with
`caffeine preview --build`.
