// ─────────────────────────────────────────────────────────────────────────────
// specEngine — turns the design-flow answers into a real, buildable spec.
//
// This is the "brain" the flow was missing: instead of dumping the chosen
// options as a flat list, it synthesises a structured spec, runs a dependency
// + conflict pass, generates an ordered build plan with copy-paste prompts, and
// audits the result. Pure TS — no React, no side effects — so it's trivially
// testable and reusable.
// ─────────────────────────────────────────────────────────────────────────────

import { EXTRA_QUESTION_LABELS } from "./specQuestions";

export type SpecAnswers = Record<string, string | string[]>;

export interface SpecOutput {
  summary: string;
  appOverview: string;
  targetUsers: string;
  coreFeatures: string;
  userRoles: string;
  screensNavigation: string;
  dataModel: string;
  designProfile: string;
  /** Domain-specific answers (from the branching questions), as a sentence. */
  specifics: string;
  ownership: string;
}

/** Collect the deeper domain/branch answers into "Label: value" fragments. */
function collectSpecifics(a: SpecAnswers): string[] {
  const out: string[] = [];
  for (const [id, label] of Object.entries(EXTRA_QUESTION_LABELS)) {
    const v = a[id];
    if (v && (Array.isArray(v) ? v.length > 0 : true)) {
      out.push(`${label}: ${Array.isArray(v) ? v.join(", ") : v}`);
    }
  }
  return out;
}

export interface BuildPhase {
  id: string;
  /** 1-based phase number */
  phase: number;
  title: string;
  description: string;
  /** Copy-paste prompt to drive this phase in Caffeine. */
  prompt: string;
}

export interface Suggestion {
  id: string;
  title: string;
  text: string;
}

export interface SpecConflict {
  id: string;
  title: string;
  text: string;
}

export interface AuditResult {
  issues: string[];
  suggestions: string[];
}

// ─── Answer helpers ───────────────────────────────────────────────────────────

function str(a: SpecAnswers, key: string): string {
  const v = a[key];
  if (Array.isArray(v)) return v.join(", ");
  return v ?? "";
}

function arr(a: SpecAnswers, key: string): string[] {
  const v = a[key];
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.length > 0) return [v];
  return [];
}

function has(a: SpecAnswers, key: string, needle: string): boolean {
  return arr(a, key).some((x) =>
    x.toLowerCase().includes(needle.toLowerCase()),
  );
}

function lower(s: string): string {
  return s.trim().toLowerCase();
}

function list(items: string[], fallback: string): string {
  const clean = items.filter(Boolean);
  if (clean.length === 0) return fallback;
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

/** Join non-empty sentence fragments with a single space (lint-friendly — no `+`). */
function join(...parts: string[]): string {
  return parts
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .join(" ");
}

// Domain inference lives in @/lib/specQuestions (the canonical, richer version).

// ─── Spec synthesis ────────────────────────────────────────────────────────────

const ROLE_DETAIL: Record<string, string> = {
  "single user (no login)":
    "A single user with no authentication — the app is a personal tool with no sign-in.",
  "public + registered":
    "Two tiers: anonymous visitors who can browse, and registered users who sign in for the full experience.",
  "admin + users":
    "Standard users plus administrators who manage content, settings, and other users.",
  "multi-tenant":
    "Multiple isolated organisations, each with their own users and data, sharing one deployment.",
  "custom roles":
    "A custom permission model with roles tailored to this app's specific responsibilities.",
};

const OWNERSHIP_DETAIL: Record<string, string> = {
  "fully self-sovereign":
    "Users hold their own data and keys. No operator — not even you — can lock them out or seize their records. This is the strongest sovereignty posture and a genuine differentiator on the Internet Computer.",
  "you own it":
    "You retain full control of the app and its data; no third-party platform can switch it off or hold it hostage. A durable middle ground.",
  "standard hosted":
    "A conventional model where the operator controls access. Simplest to reason about, but not sovereign.",
};

export function synthesizeSpec(
  projectName: string,
  a: SpecAnswers,
): SpecOutput {
  const appType = str(a, "appType") || "app";
  const problem = str(a, "problem");
  const audience = str(a, "audience");
  const core = str(a, "coreFeature");
  const secondary = arr(a, "secondaryFeatures");
  const screens = arr(a, "keyScreens");
  const data = str(a, "data");
  const roles = str(a, "userRoles");
  const scale = str(a, "scale");
  const nav = str(a, "navigation");
  const style = str(a, "styleDirection");
  const perf = str(a, "performance");
  const ownership = str(a, "dataOwnership");

  const summary = join(
    `${projectName} is a ${lower(appType)} whose core job is to ${problem ? lower(problem) : "serve its users"}.`,
    `It is built for ${audience ? lower(audience) : "its users"}, and its single most important capability is ${core ? lower(core) : "its core feature"}.`,
  );

  const appOverview = join(
    `${projectName} is a ${lower(appType)}${problem ? ` focused on helping people ${lower(problem)}` : ""}.`,
    `The product succeeds if ${core ? lower(core) : "the core feature"} works exceptionally well; everything else supports that.`,
    secondary.length > 0
      ? `Beyond the core, it also offers ${list(secondary, "")}.`
      : "It deliberately keeps scope tight around the core.",
  );

  const targetUsers = join(
    `Primary audience: ${audience || "general users"}.`,
    roles ? (ROLE_DETAIL[lower(roles)] ?? roles) : "",
    scale ? `Expected scale: ${lower(scale)}.` : "",
  );

  const coreFeatures = join(
    `Core (must-have): ${core || "—"}.`,
    secondary.length > 0
      ? `Supporting features: ${list(secondary, "none")}.`
      : "No secondary features in the first cut — ship the core first.",
  );

  const userRoles = roles
    ? join(`${roles}.`, ROLE_DETAIL[lower(roles)] ?? "")
    : "Not specified — assume a single signed-in user until decided.";

  const screensNavigation = join(
    `Key screens: ${list(screens, "to be determined")}.`,
    `Navigation pattern: ${nav || "to be determined"}.`,
    "These screens are the skeleton; build their empty shells before wiring features.",
  );

  const dataModel = join(
    `Primary data this app stores: ${data || "to be determined"}.`,
    "Model these as first-class records with clear ownership and timestamps.",
    perf ? `Performance posture: ${lower(perf)}.` : "",
  );

  const designProfile = join(
    `Look & feel: ${style || "clean and neutral"}.`,
    `Navigation: ${nav || "standard"}.`,
    "Translate this into a small, consistent token set (colour, type, spacing, radius) applied across every screen rather than ad-hoc styling.",
  );

  const ownershipText = ownership
    ? join(`${ownership}.`, OWNERSHIP_DETAIL[lower(ownership)] ?? "")
    : "Ownership not yet chosen — default to 'You own it' for Caffeine apps.";

  const specificsList = collectSpecifics(a);
  const specifics =
    specificsList.length > 0
      ? `${specificsList.join(". ")}.`
      : "No domain-specific details captured.";

  return {
    summary,
    appOverview,
    targetUsers,
    coreFeatures,
    userRoles,
    screensNavigation,
    dataModel,
    designProfile,
    specifics,
    ownership: ownershipText,
  };
}

// ─── Dependency / implication pass ─────────────────────────────────────────────

export function deriveSuggestions(a: SpecAnswers): Suggestion[] {
  const out: Suggestion[] = [];
  const core = lower(str(a, "coreFeature"));
  const roles = lower(str(a, "userRoles"));

  if (core.includes("payment") && !has(a, "data", "transaction")) {
    out.push({
      id: "pay-needs-transactions",
      title: "Payments needs a transactions record",
      text: "You chose Payments as the core feature but didn't include Transactions in the data model. Add it so orders and money movements are stored and auditable.",
    });
  }

  const needsAccounts =
    core.includes("user account") || (roles && !roles.includes("single user"));
  if (needsAccounts && !has(a, "data", "user profile")) {
    out.push({
      id: "accounts-need-profiles",
      title: "Accounts imply user profiles",
      text: "Your app has sign-in / multiple roles, so it should store User profiles. Add them to the data model.",
    });
  }

  if (
    core.includes("messaging") &&
    lower(str(a, "performance")) === "standard"
  ) {
    out.push({
      id: "messaging-realtime",
      title: "Messaging usually wants real-time",
      text: "Messaging feels broken without live updates. Consider switching the performance need to 'Real-time updates'.",
    });
  }

  if (core.includes("scheduling") && !has(a, "data", "event")) {
    out.push({
      id: "scheduling-events",
      title: "Scheduling needs events/calendar data",
      text: "A scheduling core feature implies storing Events/calendar records. Add them to the data model.",
    });
  }

  if (
    core.includes("visualization") &&
    !has(a, "keyScreens", "report") &&
    !has(a, "keyScreens", "dashboard")
  ) {
    out.push({
      id: "viz-needs-screen",
      title: "Data visualization needs a place to live",
      text: "You chose Data visualization but no Dashboard or Reports/charts screen. Add one so the charts have a home.",
    });
  }

  const wantsAdmin =
    has(a, "secondaryFeatures", "admin") || roles.includes("admin");
  if (wantsAdmin && !has(a, "keyScreens", "admin")) {
    out.push({
      id: "admin-screen",
      title: "Admin role implies an admin screen",
      text: "There are admins (or an admin panel feature) but no Admin panel screen. Add it so they have somewhere to manage things.",
    });
  }

  return out;
}

// ─── Conflict detection ────────────────────────────────────────────────────────

export function detectConflicts(a: SpecAnswers): SpecConflict[] {
  const out: SpecConflict[] = [];
  const core = lower(str(a, "coreFeature"));
  const roles = lower(str(a, "userRoles"));
  const scale = lower(str(a, "scale"));

  if (roles.includes("single user") && core.includes("user account")) {
    out.push({
      id: "no-login-vs-accounts",
      title: "No-login vs. user accounts",
      text: "You picked 'Single user (no login)' for roles but 'User accounts' as the core feature. Accounts require sign-in — pick one direction.",
    });
  }

  if (
    roles.includes("single user") &&
    (scale.includes("enterprise") || scale.includes("mid-size"))
  ) {
    out.push({
      id: "no-login-vs-scale",
      title: "No-login at company scale",
      text: "A single-user, no-login app doesn't fit an enterprise / mid-size scale. If many people use it, you'll need real accounts and roles.",
    });
  }

  if (
    core.includes("payment") &&
    lower(str(a, "dataOwnership")).includes("self-sovereign")
  ) {
    out.push({
      id: "payments-vs-sovereign",
      title: "Payments + fully self-sovereign is advanced",
      text: "Taking payments while users custody their own keys/data is possible but non-trivial. Make sure you actually need full self-sovereignty here, or choose 'You own it'.",
    });
  }

  return out;
}

// ─── Build plan ────────────────────────────────────────────────────────────────

export function generateBuildPlan(
  projectName: string,
  a: SpecAnswers,
): BuildPhase[] {
  const appType = lower(str(a, "appType") || "app");
  const core = str(a, "coreFeature") || "the core feature";
  const screens = arr(a, "keyScreens");
  const screensText = list(screens, "the key screens");
  const nav = str(a, "navigation") || "a standard navigation pattern";
  const style = str(a, "styleDirection") || "a clean, consistent style";
  const data = str(a, "data") || "the core records";
  const secondary = arr(a, "secondaryFeatures");
  const secondaryText = list(secondary, "the supporting features");
  const roles = str(a, "userRoles") || "the user roles";
  const perf = str(a, "performance");
  const specifics = collectSpecifics(a).join("; ");
  const ownership = str(a, "dataOwnership");

  return [
    {
      id: "shell",
      phase: 1,
      title: "App shell & navigation",
      description:
        "Routing, layout, and empty page scaffolds. No features yet.",
      prompt: join(
        `Build the app shell for "${projectName}", a ${appType}.`,
        `Set up ${lower(nav)} with these top-level screens as empty scaffolds: ${screensText}.`,
        `Apply a ${lower(style)} visual direction as a small token set (colour, type, spacing, radius).`,
        "No business logic yet — just navigation, routing, and placeholder pages that I can click between.",
      ),
    },
    {
      id: "data-model",
      phase: 2,
      title: "Data model",
      description: "Define and persist the core records before features.",
      prompt: join(
        `For "${projectName}", define the backend data model.`,
        `The primary data is: ${data}.`,
        "Model each as a first-class record with a stable id, timestamps, and an owner field.",
        "Implement create/read/update/delete and persistence. Keep it minimal but real — no mock data.",
      ),
    },
    {
      id: "core-feature",
      phase: 3,
      title: `Core feature: ${core}`,
      description: "The one thing the app must do well — build it end to end.",
      prompt: join(
        `Implement the core feature of "${projectName}": ${core}.`,
        "This is the heart of the app — make it work end to end against the real data model from phase 2, including the primary user flow a person takes to get value from it.",
        specifics ? `Honour these specifics: ${specifics}.` : "",
        "Don't start other features until this one genuinely works.",
      ),
    },
    {
      id: "roles-auth",
      phase: 4,
      title: "Accounts & roles",
      description: "Sign-in and permissions, scoped to what's needed.",
      prompt: join(
        `Add accounts and permissions to "${projectName}".`,
        `Roles: ${roles}.`,
        "Implement sign-in and gate actions by role. Scope this tightly — only the permissions the app actually needs.",
        "Make sure each record created in earlier phases is correctly owned by the user who created it.",
      ),
    },
    {
      id: "secondary",
      phase: 5,
      title: "Supporting features",
      description: "The nice-to-haves, now that the core is solid.",
      prompt: join(
        `With the core working, add the supporting features to "${projectName}": ${secondaryText}.`,
        "Build them one at a time, each fully finished before the next.",
        "If any of them complicate the core experience, leave them out.",
      ),
    },
    {
      id: "visual-system",
      phase: 6,
      title: "Visual polish",
      description: "Make every screen feel like one coherent product.",
      prompt: join(
        `Do a visual pass over "${projectName}" so every screen feels like one product.`,
        `Apply the ${lower(style)} direction consistently: same tokens, spacing, and components everywhere.`,
        "Tidy empty states, loading states, and error states.",
        perf ? `Honour this performance posture: ${lower(perf)}.` : "",
        "No new features — just coherence and polish.",
      ),
    },
    {
      id: "production",
      phase: 7,
      title: "Production readiness",
      description: "Edge cases, ownership, and ship.",
      prompt: join(
        `Final hardening for "${projectName}".`,
        "Handle edge cases and validation across the main flows.",
        ownership
          ? `Honour the chosen ownership model: ${ownership} — make sure data ownership and access reflect it.`
          : "",
        "Confirm there's no mock data left, errors are handled gracefully, and the app is ready to go live.",
      ),
    },
  ];
}

// ─── Audit ─────────────────────────────────────────────────────────────────────

const VAGUE_PROBLEMS = [
  "save time",
  "make money",
  "connect people",
  "store information",
  "automate tasks",
  "entertain",
  "educate",
  "other",
];

export function auditSpec(a: SpecAnswers): AuditResult {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!str(a, "coreFeature")) {
    issues.push(
      "No core feature chosen — the build plan has no centre of gravity. Pick the one thing the app must do well.",
    );
  }
  if (arr(a, "keyScreens").length === 0) {
    issues.push(
      "No key screens selected — there's nothing to scaffold in phase 1.",
    );
  }
  if (!str(a, "data")) {
    issues.push(
      "No data specified — the app won't have anything to store or remember.",
    );
  }

  if (VAGUE_PROBLEMS.includes(lower(str(a, "problem")))) {
    suggestions.push(
      `"${str(a, "problem")}" is a broad goal, not a sharp problem. When you build, describe the specific job in one concrete sentence (e.g. "help freelancers send invoices and chase late payments").`,
    );
  }
  if (arr(a, "secondaryFeatures").length > 3) {
    suggestions.push(
      "You've picked several secondary features. Consider cutting to the two that matter most for the first version.",
    );
  }
  if (!str(a, "dataOwnership")) {
    suggestions.push(
      "Ownership isn't set. Caffeine apps run on the Internet Computer, so you can offer real data sovereignty — worth deciding deliberately.",
    );
  }

  return { issues, suggestions };
}

// ─── Markdown export (full spec + plan) ─────────────────────────────────────────

export function assembleFullMarkdown(
  projectName: string,
  a: SpecAnswers,
): string {
  const spec = synthesizeSpec(projectName, a);
  const plan = generateBuildPlan(projectName, a);
  const suggestions = deriveSuggestions(a);
  const conflicts = detectConflicts(a);
  const audit = auditSpec(a);

  const L: string[] = [];
  L.push(`# ${projectName} — App Specification`, "");
  L.push(
    `_Generated ${new Date().toLocaleDateString()} with Caffeine Designer._`,
    "",
  );
  L.push("---", "");

  L.push("## Summary", "", spec.summary, "");
  L.push("## Overview", "", spec.appOverview, "");
  L.push("## Target users", "", spec.targetUsers, "");
  L.push("## Core & supporting features", "", spec.coreFeatures, "");
  if (collectSpecifics(a).length > 0) {
    L.push("## Specifics", "", spec.specifics, "");
  }
  L.push("## User roles", "", spec.userRoles, "");
  L.push("## Screens & navigation", "", spec.screensNavigation, "");
  L.push("## Data model", "", spec.dataModel, "");
  L.push("## Design profile", "", spec.designProfile, "");
  L.push("## Ownership & sovereignty", "", spec.ownership, "");

  if (conflicts.length > 0) {
    L.push("", "## ⚠ Conflicts to resolve", "");
    for (const c of conflicts) L.push(`- **${c.title}** — ${c.text}`);
  }
  if (suggestions.length > 0) {
    L.push("", "## Suggestions", "");
    for (const s of suggestions) L.push(`- **${s.title}** — ${s.text}`);
  }
  if (audit.issues.length > 0) {
    L.push("", "## Gaps", "");
    for (const i of audit.issues) L.push(`- ${i}`);
  }

  L.push("", "---", "", "## Build plan", "");
  L.push(
    "Build in this order. Paste each phase's prompt into Caffeine one at a time, finishing each before starting the next.",
    "",
  );
  for (const p of plan) {
    L.push(`### Phase ${p.phase} — ${p.title}`, "");
    L.push(`_${p.description}_`, "");
    L.push("```", p.prompt, "```", "");
  }

  return L.join("\n");
}
