# Caffeine Designer — Full Code Review (2026-06-22)

> Dated, disposable snapshot. Not a source of truth — `NORTH-STAR.md` is direction,
> `PROJECT_NOTES.md` is status. Reviewed at `~/Desktop/caffeine-apps/caffeine-designer`
> (the project moved out of `market/` during this review). ~42k lines:
> Motoko backend (dead/unwired) + React 18/TS/Tailwind/Zustand frontend (fully simulated).

## TL;DR

The **infrastructure is strong** (clean OKLCH token system, well-typed pure spec engine,
sane build config) but the app is **leaky at the seams**: three independent data-seed
sources disagree on project identity, two real user-visible bugs make detail screens show
the wrong app, ~30 orphaned files (two whole dead directories) inflate the tree, the
Motoko backend has silently drifted out of sync with the frontend, and ~200 raw palette
classes + ~90 hex literals bypass the "token-only" design rule.

Nothing crashes. But several screens render **confidently wrong data**, which for a
spec-design tool is worse than an error.

---

## Critical (user-visible wrong data)

1. **Every "Live app" detail opens the same wrong mock app.**
   `pages/LiveAppDetailPage.tsx:11` — `LIVE_APPS.find(a => a.id === appId) ?? LIVE_APPS[0]`.
   `LivePage` derives its rows from **real store projects** (`LivePage.tsx:70`, `id: p.id`),
   but the detail page looks `appId` up in the **static `LIVE_APPS` mock**. Real ids never
   match, so every click silently falls back to `LIVE_APPS[0]` ("community-hub").
   → Route the detail page through the same `deriveLiveApps(projects)` source as `LivePage`;
   replace `?? LIVE_APPS[0]` with a real not-found state.

2. **Every project detail can render ClearPath Practice's data.**
   `projectDetailData.ts:2308` — `getProjectDetailData(id)` returns `DATA[id] ?? DATA["proj-1"]`
   (and `getExtendedProjectData` falls back to proj-1's review/analyze data). Any id that
   isn't literally `proj-1..6` — i.e. **every user-created `project-*` and every `sample-*`** —
   silently shows proj-1's features, team, builds and costs as its own.
   → Return null/empty and render an empty state, or key detail data off a project field, not id.

3. **Two disagreeing project seed sets (the root cause behind #2 and the dead hubs).**
   The store persists projects as `proj-1..6` (`useAppStore.ts:188-464`); `SAMPLE_PROJECTS`
   uses `sample-1..6` with different names/icons/statuses (`sampleProjects.ts:18-328`).
   `useProjects` only loads `SAMPLE_PROJECTS` when `projects.length === 0`, which never happens
   (store always rehydrates the 6 `proj-*`), so `SAMPLE_PROJECTS` is **dead at runtime** — yet
   `ProjectDetailPage.tsx:121` falls back to it by id, a match that can never succeed.
   → Collapse to **one** id scheme + **one** seed array, imported by both the store and
   `localFallback`. This single fix also repairs #2 and the broken hubs (#4) in one stroke.

4. **Seeded hubs reference projects that don't exist.**
   `useAppStore.ts:473-492` — `hub-sample-1/2` list `projectIds`/`nodes` on `sample-1,2,3,5,6`,
   but the seeded projects are `proj-1..6`. The Hubs view resolves **zero** member projects.
   → Renumber to `proj-*` (subsumed by #3's unification).

---

## High

5. **"Community Hub appears twice" — confirmed root cause.**
   `useAppStore.ts:251-260` — `proj-2` is `deploymentStatus: "live"` **and**
   `metadata.maturity: "building"`. Any view bucketing by `deploymentStatus==="live"` *and* by
   `maturity==="building"` (e.g. `projectIcons.ts:98-102` `getIconColorClass`) classifies the
   one project into two states. (Note: `sampleProjects.ts` does *not* have this — it's specific
   to the store seed.) → Set `proj-2.metadata.maturity = "live"`.

6. **Backend has silently drifted and is 100% dead.**
   The Motoko canister is a clean, would-compile CRUD app whose Candid matches its types — but
   the frontend makes **zero** calls to it. `useBackendActor` (`frontend/src/lib/backend.ts:14`)
   is exported and never imported; the sole data path is `localFallback` → `localStorage`.
   Worse, its model has drifted: frontend `Project` adds ~15 fields the backend `Project`
   (`types/project.mo:73-86`) has no concept of, and `UIState` (`types/ui.mo:20-26`) can't
   round-trip the real Zustand store. → Decide its fate: wire `useProjects` to the actor (and
   reconcile types) **or** remove the canister so it isn't mistaken for live infrastructure.
   If revived, **add access control first** — every mutation in `mixins/projects-api.mo` ignores
   `caller`, so any principal can edit/delete any project.

7. **Backend correctness bugs (latent until wired).**
   - `lib/projects.mo:74-91` `setSpec`/`setAnswers` snapshot `project.answers` instead of the
     content being saved — the "immutable version snapshot" never captures spec content.
   - `mixins/projects-api.mo:90-107` `incrementCloneCount` is a no-op (there's no clone counter
     in the model; it just bumps `updatedAt`).

8. **`manage/LiveAppDetail.tsx` is a 1635-line / ~25-`useState` monolith — with its
   replacement already written and orphaned.** The extracted `manage/*Panel.tsx`
   (Deploy/Users/Cycles/Settings/Access/Operations) exist but are never wired in — a refactor
   started and abandoned. → Wire the panels in as tab bodies; delete the inlined duplicates.

---

## Medium

9. **Split status vocabulary, no shared mapping.** Projects/Home read `deploymentStatus`/
   `maturity` → Live/Building/Draft; Live independently re-derives Running/Degraded/Offline from
   burn rate (`LivePage.tsx:42-57` `deriveHealth`). The same project can read "Live" on Projects
   and "Degraded" on Live. → Centralize one `deriveStatus(project)` helper next to `format.ts`.

10. **~30 orphaned files / two dead directories.** Verified by import-resolution scan:
    - `components/LiveAppDetail.tsx` (582 lines — the **dead** twin; the live one is
      `manage/LiveAppDetail.tsx`, routed via `pages/LiveAppDetailPage.tsx:5`)
    - entire `components/iterate/` and `components/organize/` dirs
    - `components/onboarding/OnboardingFlow.tsx` (919), `market/PublishToMarketInline.tsx` (768),
      `OnboardingWalkthrough.tsx`, `Develop/{DecisionTimeline,RightPanel,SpecDraftPanel}.tsx`,
      the orphaned `manage/*Panel.tsx`, unused `ui/{sheet,dialog,label,separator,toggle,skeleton}.tsx`
    → Delete or move to `_archive/`. Removing the dead `LiveAppDetail.tsx` kills the
    duplicate-name hazard that prompted this review.

11. **`localFallback.createProject` omits all `ProjectExtraFields`** (`backend.ts:99-127`) —
    new projects lack `marketStatus`/`verificationStatus`/`linesOfCode`/`burnRate` that seeds
    have, so sorts/reads that don't `??`-guard treat new vs seeded projects inconsistently.
    → Initialize extras to defaults.

12. **DesignPage focused-mode has no unmount safety net.** All four in-page exits correctly call
    `endDesignFlow()`, but there's no `useEffect` cleanup (`DesignPage.tsx:1337`), so a
    programmatic redirect / browser-back while active leaves the global TopBar hidden
    (`AppShell.tsx:37`). → `useEffect(() => () => endDesignFlow(), [])`.

13. **Design-system leakage** (the "one design system, token-only" rule):
    - **202** raw Tailwind palette classes (`text-emerald-600`, `bg-amber-500`…)
    - **~90** raw hex literals; **15** `rgba()` (OKLCH-only rule)
    - **215** arbitrary `text-[10px]`/`[11px]` despite `text-2xs`/`xs-plus` tokens existing
    - Worst file by far: `manage/LiveAppDetail.tsx` (37 hex, 40 `[NNpx]`, literal-color inline styles)
    → Fix `ui/AppButton.tsx` once + sweep `manage/`, `tabs/`, `Develop/`.

14. **DESIGN.md constraint violations.** Two `<h1>` on `pages/CreatorProfilePage.tsx:108,159`
    (one-heading rule). Grayed/disabled buttons (DESIGN.md says remove, don't gray): baked into
    `ui/AppButton.tsx:68` (`opacity-50 cursor-not-allowed`), plus `DesignPage.tsx:792`,
    `SpecializePage.tsx:833,969`. (Full-width-bar rule is fine — only shells/overlays use `w-screen`.)

---

## Low / Nits

- `LivePage.tsx:134-165` `OverviewCards` shows hardcoded trend deltas (`+12%`, `-2%`…) ignoring real data.
- `MarketPage.tsx:1326` `"★".repeat(Math.floor(app.rating))` — safe today, RangeError if any
  `rating` becomes undefined; guard `?? 0`.
- `types/index.ts:288-326` `DesignFlowAnswers` is dead **and** misleading — its keys
  (`coreFeatures`, `rolesAccess`…) are legacy plurals that don't match the live flow keys the
  spec engine consumes (`coreFeature`, `userRoles`, `data`). Delete or reconcile.
- `types/index.ts:99-106` `ProjectBurnRate` intersected twice; `priority` duplicated on root + metadata.
- `backend.ts:48-57` bigint reviver is keyed on hardcoded field names — future bigint fields
  silently stay strings.
- **Cruft to delete:** `_tmp_23_4d2cb9fc5c8b9831ace0f17fb0f4c15f` + its " 2" twin (0 bytes, **not**
  gitignored — would be committed); `src/frontend/src/index.css.bak` (dead 706-line stale copy);
  `.old/` (build artifact).
- **Config smells:** root `package.json` name still `@caffeine/template-app` (+ frontend
  `@caffeine/template-frontend`); `@caffeineai/core-infrastructure` pinned `^0.2.0` (root) vs
  `^0.3.0` (frontend); `tsconfig.json` `outDir: "HACK_BECAUSE_OF_ALLOW_JS"`.

---

## What's genuinely good

- `index.css` — 1,448 lines of pure OKLCH (519 `oklch()`, **zero** hsl/rgb), full skin system,
  bento palette. The token foundation is exemplary; `tailwind.config.js` maps ~120 semantic tokens.
- `specEngine.ts` / `specQuestions.ts` — well-typed, side-effect-free; base STEPS ids line up
  exactly with the keys the engine reads; branch/conflict/audit passes are coherent.
- Backend persistence model is correct (enhanced orthogonal persistence, no `stable`/upgrade-hook
  hazards) — it's dead and drifted, not broken.
- biome/postcss/tailwind config is sane; inline-style usage is mostly token-compliant (only 5 of
  231 use a literal color).

## Suggested order of attack

1. **Unify the seed + id scheme** (#3) — one change repairs #2, #4, and the dead `SAMPLE_PROJECTS`.
2. **Fix the two detail-page data sources** (#1, #2) and **`proj-2` live/building** (#5).
3. **Delete the ~30 orphaned files** (#10) — removes the duplicate-`LiveAppDetail` trap.
4. **Decide the backend's fate** (#6) — wire-and-reconcile or remove.
5. Then: centralize `deriveStatus` (#9), the design-token sweep (#13/#14), cruft + config (#Low).
