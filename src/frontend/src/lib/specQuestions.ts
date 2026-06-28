// ─────────────────────────────────────────────────────────────────────────────
// specQuestions — the domain-aware, branching question engine.
//
// The base flow asks the same 13 questions of everyone. This module deepens it:
// once we can infer what the person is building (a shop, a social app, a
// dashboard, a booking tool…), it injects domain-specific questions, and it
// inserts follow-up ("branch") questions when an earlier answer warrants them
// (e.g. "Payments" → "one-time or subscription?" → "how many plans?").
//
// Pure data + pure functions. No React. The flow recomputes the question list
// from the current answers after every choice, so the interview grows and
// adapts as it goes.
// ─────────────────────────────────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react";

// ─── Shared question types (the single source of truth) ─────────────────────────

export type StepOption =
  | string
  | { label: string; description?: string; icon?: LucideIcon };

export interface StepDef {
  id: string;
  label: string;
  question: string;
  hint: string;
  /** Friendly, anxiety-lowering line shown under the question. */
  reassure?: string;
  options: StepOption[];
  multiSelect?: boolean;
  maxSelect?: number;
  phase: string;
}

export type Answers = Record<string, string | string[]>;

export function optLabel(o: StepOption): string {
  return typeof o === "string" ? o : o.label;
}
export function optDesc(o: StepOption): string | undefined {
  return typeof o === "string" ? undefined : o.description;
}
export function optIcon(o: StepOption): LucideIcon | undefined {
  return typeof o === "string" ? undefined : o.icon;
}

// ─── Answer helpers ─────────────────────────────────────────────────────────────

function str(a: Answers, key: string): string {
  const v = a[key];
  return Array.isArray(v)
    ? v.join(", ").toLowerCase()
    : (v ?? "").toLowerCase();
}
function arr(a: Answers, key: string): string[] {
  const v = a[key];
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v) return [v];
  return [];
}
function has(a: Answers, key: string, needle: string): boolean {
  return arr(a, key).some((x) =>
    x.toLowerCase().includes(needle.toLowerCase()),
  );
}

const DETAILS_PHASE = "The details";

// ─── Domain inference ────────────────────────────────────────────────────────────

export type Domain =
  | "ecommerce"
  | "social"
  | "content"
  | "dashboard"
  | "booking"
  | "productivity"
  | "saas"
  | "marketplace"
  | "events"
  | "education"
  | "health"
  | "generic";

/** Infer the domain from base answers alone (no explicit category hint). */
function inferBaseDomain(a: Answers): Domain {
  const appType = str(a, "appType");
  const core = str(a, "coreFeature");
  const audience = str(a, "audience");
  const problem = str(a, "problem");

  if (
    appType.includes("commerce") &&
    (audience.includes("business") || audience.includes("community"))
  ) {
    return "marketplace";
  }
  if (appType.includes("commerce") || core.includes("payment")) {
    return "ecommerce";
  }
  if (appType.includes("social") || core.includes("messaging")) return "social";
  if (appType.includes("dashboard") || core.includes("visualization")) {
    return "dashboard";
  }
  if (problem.includes("educate")) return "education";
  if (core.includes("scheduling")) return "booking";
  if (core.includes("content")) return "content";
  if (
    appType.includes("productivity") &&
    (audience.includes("business") || audience.includes("community"))
  ) {
    return "saas";
  }
  if (appType.includes("productivity")) return "productivity";
  return "generic";
}

/** Resolve the domain — an explicit category answer wins over inference. */
export function inferDomain(a: Answers): Domain {
  const hint = str(a, "domainHint");
  if (hint.includes("marketplace")) return "marketplace";
  if (hint.includes("event")) return "events";
  if (hint.includes("education")) return "education";
  if (hint.includes("health")) return "health";
  return inferBaseDomain(a);
}

// ─── Domain question modules ─────────────────────────────────────────────────────

const DOMAIN_QUESTIONS: Record<Domain, StepDef[]> = {
  ecommerce: [
    {
      id: "sellType",
      label: "What you sell",
      question: "What are you selling?",
      hint: "Shapes the catalog, checkout, and fulfilment model.",
      reassure: "Pick the closest fit — you can sell more than one kind later.",
      options: [
        { label: "Physical products", description: "Things you ship" },
        {
          label: "Digital downloads",
          description: "Files delivered instantly",
        },
        { label: "Services", description: "Work people book or buy" },
        { label: "Subscriptions", description: "Recurring access or boxes" },
        { label: "A mix", description: "More than one of the above" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "inventory",
      label: "Inventory",
      question: "Do you need to track stock?",
      hint: "Determines whether we build an inventory model.",
      reassure: "Only matters if you can run out of something.",
      options: [
        {
          label: "Track inventory",
          description: "Counts go down as people buy",
        },
        { label: "No limits", description: "Unlimited / digital" },
        { label: "Made to order", description: "Produced after purchase" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "fulfilment",
      label: "Fulfilment",
      question: "How do orders get fulfilled?",
      hint: "Shapes the post-purchase flow.",
      options: [
        { label: "Shipping", description: "Posted to an address" },
        { label: "Local pickup", description: "Collected in person" },
        { label: "Instant digital", description: "Delivered automatically" },
        { label: "Booked appointment", description: "Scheduled afterwards" },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  social: [
    {
      id: "postType",
      label: "What people share",
      question: "What do people share?",
      hint: "Defines the core content object.",
      reassure: "Pick up to 2 — the main things people will post.",
      options: [
        "Text posts",
        "Photos & video",
        "Links",
        "Short updates",
        "Long articles",
        "Audio",
      ],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
    {
      id: "socialGraph",
      label: "Connections",
      question: "How do people connect?",
      hint: "Defines the relationship model and the feed.",
      options: [
        { label: "Follow", description: "One-way, like Twitter/Instagram" },
        { label: "Friend (mutual)", description: "Both sides agree" },
        { label: "Join groups", description: "Membership-based communities" },
        { label: "Public only", description: "No accounts to follow" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "moderation",
      label: "Moderation",
      question: "Do you need moderation tools?",
      hint: "User-generated content usually needs a safety valve.",
      reassure: "If strangers can post, you'll want at least light tools.",
      options: [
        { label: "Full tools", description: "Reports, review queue, bans" },
        { label: "Light", description: "Admins can delete things" },
        { label: "None yet", description: "Trusted users only" },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  content: [
    {
      id: "contentKind",
      label: "Content type",
      question: "What kind of content is it?",
      hint: "Shapes the editor and the content schema.",
      options: [
        { label: "Articles / blog", description: "Posts with a publish date" },
        { label: "Docs / knowledge base", description: "Organised reference" },
        { label: "Media library", description: "Images, video, files" },
        { label: "Listings / directory", description: "Many similar entries" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "authoring",
      label: "Authors",
      question: "Who creates the content?",
      hint: "Defines the authoring permissions.",
      options: [
        { label: "Just admins", description: "A small trusted team" },
        { label: "Invited authors", description: "Approved contributors" },
        { label: "Any registered user", description: "Open contribution" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "contentState",
      label: "Publishing",
      question: "Does content need drafts or review?",
      hint: "Adds a workflow state machine if needed.",
      options: [
        {
          label: "Publish instantly",
          description: "Live the moment it's saved",
        },
        { label: "Draft then publish", description: "Save privately first" },
        {
          label: "Editorial review",
          description: "Someone approves before live",
        },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  dashboard: [
    {
      id: "dataSources",
      label: "Data source",
      question: "Where does the data come from?",
      hint: "Determines ingestion and the data pipeline.",
      reassure: "Pick up to 2 — where the numbers originate.",
      options: [
        "Manual entry",
        "Uploaded files (CSV/Excel)",
        "Connected apps / APIs",
        "Other apps you build",
        "A database",
      ],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
    {
      id: "vizType",
      label: "Visuals",
      question: "How should the data be shown?",
      hint: "Shapes the component library for the dashboard.",
      reassure: "Pick up to 2 — the main way people read it.",
      options: ["Charts", "Tables", "Maps", "KPI cards", "Timelines"],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
    {
      id: "refresh",
      label: "Freshness",
      question: "How fresh must the data be?",
      hint: "Drives the performance + caching strategy.",
      options: [
        { label: "Live", description: "Updates the instant it changes" },
        { label: "Hourly", description: "Refreshed periodically" },
        { label: "Daily", description: "A once-a-day snapshot is fine" },
        { label: "On demand", description: "Only when someone asks" },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  booking: [
    {
      id: "bookResource",
      label: "What's booked",
      question: "What gets booked?",
      hint: "Defines the resource model behind the calendar.",
      options: [
        { label: "People's time", description: "Appointments with staff" },
        { label: "Rooms / spaces", description: "Venues, desks, studios" },
        { label: "Equipment", description: "Gear or vehicles" },
        { label: "Classes / events", description: "Many people, one slot" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "availability",
      label: "Availability",
      question: "How is availability set?",
      hint: "Drives the scheduling engine.",
      options: [
        { label: "Fixed hours", description: "Same opening times" },
        { label: "Per-person calendars", description: "Each provider's own" },
        { label: "Limited slots", description: "A set number per slot" },
        { label: "Always available", description: "No scarcity" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "bookingPayment",
      label: "Booking payment",
      question: "Do bookings need payment?",
      hint: "Decides whether checkout is part of booking.",
      options: [
        { label: "Free", description: "No payment to book" },
        { label: "Pay to book", description: "Full payment up front" },
        { label: "Deposit", description: "Part now, rest later" },
        { label: "Pay after", description: "Charged afterwards" },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  productivity: [
    {
      id: "workUnit",
      label: "Core record",
      question: "What's the main thing people track?",
      hint: "Defines the central object of the app.",
      options: [
        { label: "Tasks", description: "To-dos with status" },
        { label: "Projects", description: "Groups of work" },
        { label: "Notes", description: "Free-form writing" },
        { label: "Habits", description: "Recurring streaks" },
        { label: "Time", description: "Logged hours" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "collaboration",
      label: "Collaboration",
      question: "Is it solo or shared?",
      hint: "Decides whether we build sharing + permissions.",
      options: [
        { label: "Just me", description: "A personal tool" },
        { label: "Shared with a few", description: "A small group" },
        { label: "Whole team", description: "Org-wide, with roles" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "views",
      label: "Views",
      question: "How do people want to see their work?",
      hint: "Shapes the main screens.",
      reassure: "Pick up to 2 — the views you'd use most.",
      options: ["List", "Board (kanban)", "Calendar", "Timeline", "Table"],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
  ],
  saas: [
    {
      id: "recordType",
      label: "Core record",
      question: "What's the core record this tool manages?",
      hint: "The central entity of an internal/business tool.",
      options: [
        { label: "Customers / contacts", description: "People you deal with" },
        { label: "Tickets / requests", description: "Things to resolve" },
        { label: "Deals / pipeline", description: "Opportunities to track" },
        { label: "Assets / inventory", description: "Things you own/manage" },
        { label: "Documents / records", description: "Files and forms" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "teamStructure",
      label: "Team shape",
      question: "How is the team organised?",
      hint: "Drives the tenancy + grouping model.",
      options: [
        { label: "Flat", description: "Everyone in one group" },
        { label: "Departments", description: "Teams within one company" },
        { label: "Clients / accounts", description: "Work grouped by client" },
        { label: "Multi-company", description: "Separate organisations" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "access",
      label: "Access control",
      question: "How tight does access need to be?",
      hint: "Defines the permission granularity.",
      options: [
        { label: "Everyone sees all", description: "Simple, open" },
        { label: "Role-based", description: "By job function" },
        { label: "Per-record", description: "Only what's assigned to you" },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  marketplace: [
    {
      id: "sides",
      label: "Two sides",
      question: "Who are the two sides of the marketplace?",
      hint: "Defines the dual-role model.",
      options: [
        { label: "Buyers & sellers", description: "Shoppers and merchants" },
        { label: "Clients & providers", description: "Hire and get hired" },
        { label: "Hosts & guests", description: "List and book spaces" },
        { label: "Employers & workers", description: "Post and take jobs" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "listingType",
      label: "Listings",
      question: "What gets listed?",
      hint: "Defines the listing schema.",
      options: [
        { label: "Products", description: "Physical or digital goods" },
        { label: "Services", description: "Work offered for hire" },
        { label: "Rentals", description: "Things or spaces by time" },
        { label: "Gigs / jobs", description: "One-off pieces of work" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "marketTrust",
      label: "Trust",
      question: "How do you build trust between strangers?",
      hint: "Critical for any marketplace.",
      reassure: "Pick up to 2 — ratings are the simplest start.",
      options: [
        "Ratings & reviews",
        "ID verification",
        "Escrow payments",
        "In-app messaging",
      ],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
  ],
  events: [
    {
      id: "eventType",
      label: "Event type",
      question: "What kind of events?",
      hint: "Shapes the event model.",
      options: [
        { label: "One-off events", description: "Single dates" },
        { label: "Recurring classes", description: "Repeating sessions" },
        { label: "Conferences", description: "Multi-session, multi-track" },
        { label: "Community meetups", description: "Informal gatherings" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "ticketing",
      label: "Attendance",
      question: "How do people attend?",
      hint: "Decides ticketing + capacity logic.",
      options: [
        { label: "Free RSVP", description: "Just sign up" },
        { label: "Paid tickets", description: "Buy to attend" },
        { label: "Invite only", description: "Approved guests" },
        { label: "Capacity-limited", description: "Limited seats" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "eventExtras",
      label: "Around the event",
      question: "What matters most around the event?",
      hint: "Shapes the supporting features.",
      reassure: "Pick up to 2.",
      options: [
        "Schedule / agenda",
        "Check-in",
        "Speakers / hosts",
        "Networking",
      ],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
  ],
  education: [
    {
      id: "learnUnit",
      label: "Learning unit",
      question: "What do learners work through?",
      hint: "Defines the core learning object.",
      options: [
        { label: "Courses", description: "Structured, multi-lesson" },
        { label: "Lessons", description: "Standalone pieces" },
        { label: "Quizzes / tests", description: "Assessments" },
        { label: "Live classes", description: "Scheduled sessions" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "progress",
      label: "Progress",
      question: "How is progress tracked?",
      hint: "Drives the progress + rewards model.",
      options: [
        { label: "Completion %", description: "How far through" },
        { label: "Grades / scores", description: "Marks on work" },
        { label: "Certificates", description: "Proof of completion" },
        { label: "Streaks", description: "Daily consistency" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "eduRoles",
      label: "People involved",
      question: "Who's involved beyond learners?",
      hint: "Defines the role model.",
      options: [
        { label: "Just learners", description: "Self-serve" },
        { label: "Teachers & students", description: "Instructors lead" },
        { label: "Parents too", description: "Guardians see progress" },
        { label: "School / admin", description: "Institution oversight" },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  health: [
    {
      id: "healthFocus",
      label: "Health focus",
      question: "What's the main health focus?",
      hint: "Defines the core of the app.",
      options: [
        { label: "Tracking", description: "Logs and measurements" },
        { label: "Appointments", description: "Booking care" },
        { label: "Programs / plans", description: "Guided routines" },
        { label: "Content / education", description: "Advice and info" },
      ],
      phase: DETAILS_PHASE,
    },
    {
      id: "healthData",
      label: "What's recorded",
      question: "What gets recorded?",
      hint: "Shapes the health data model.",
      reassure: "Pick up to 2 — the main things people log.",
      options: [
        "Symptoms / measurements",
        "Activity / exercise",
        "Nutrition",
        "Mood / wellbeing",
      ],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
    {
      id: "healthPrivacy",
      label: "Data sensitivity",
      question: "How sensitive is the health data?",
      hint: "Health data needs careful ownership — this leans on the sovereignty model.",
      reassure: "When in doubt, choose the most private option.",
      options: [
        { label: "Personal only", description: "Just the individual" },
        { label: "Shared with a provider", description: "A clinician sees it" },
        {
          label: "Clinical / regulated",
          description: "Subject to health rules",
        },
      ],
      phase: DETAILS_PHASE,
    },
  ],
  generic: [],
};

// ─── Branch rules (follow-up questions) ──────────────────────────────────────────
// Ordered parents-first so a child can be inserted after its parent.

interface BranchRule {
  /** id of the question this rule provides (must match question.id) */
  id: string;
  /** Insert the question right after the step with this id. */
  after: string;
  when: (a: Answers, domain: Domain) => boolean;
  question: StepDef;
}

const BRANCH_RULES: BranchRule[] = [
  {
    id: "domainHint",
    after: "problem",
    when: (a) =>
      str(a, "appType").length > 0 && inferBaseDomain(a) === "generic",
    question: {
      id: "domainHint",
      label: "Category",
      question: "Which of these is it closest to?",
      hint: "Helps us ask the right follow-up questions.",
      reassure: "Pick the nearest — or 'Something else' if none fit.",
      options: [
        { label: "Marketplace", description: "Two sides: buyers & sellers" },
        { label: "Events", description: "Classes, meetups, tickets" },
        { label: "Education", description: "Courses, lessons, learning" },
        { label: "Health & wellness", description: "Tracking, care, plans" },
        { label: "Something else", description: "None of these fit" },
      ],
      phase: "The idea",
    },
  },
  {
    id: "paymentModel",
    after: "secondaryFeatures",
    when: (a, d) =>
      has(a, "coreFeature", "payment") ||
      d === "ecommerce" ||
      d === "marketplace" ||
      (d === "booking" && !has(a, "bookingPayment", "free")) ||
      has(a, "sellType", "subscription"),
    question: {
      id: "paymentModel",
      label: "Payment model",
      question: "How do payments work?",
      hint: "Defines the billing architecture.",
      reassure: "Pick the one that matches how money comes in.",
      options: [
        { label: "One-time", description: "Pay per purchase" },
        { label: "Subscription", description: "Recurring billing" },
        { label: "Usage-based", description: "Pay for what you use" },
        {
          label: "Marketplace split",
          description: "You take a cut of others' sales",
        },
      ],
      phase: DETAILS_PHASE,
    },
  },
  {
    id: "subscriptionTiers",
    after: "paymentModel",
    when: (a) => has(a, "paymentModel", "subscription"),
    question: {
      id: "subscriptionTiers",
      label: "Plans",
      question: "How many plans will you offer?",
      hint: "Shapes the pricing + entitlement model.",
      options: [
        { label: "One plan", description: "A single paid tier" },
        { label: "A few tiers", description: "Good / better / best" },
        { label: "Free + paid", description: "A free tier plus upgrades" },
      ],
      phase: DETAILS_PHASE,
    },
  },
  {
    id: "messagingScope",
    after: "coreFeature",
    when: (a, d) => has(a, "coreFeature", "messaging") || d === "social",
    question: {
      id: "messagingScope",
      label: "Messaging",
      question: "What kind of messaging?",
      hint: "Defines the chat data model.",
      options: [
        { label: "1:1 direct messages", description: "Private conversations" },
        { label: "Group chats", description: "Many people in a thread" },
        { label: "Comments only", description: "Replies on content" },
        { label: "Broadcast", description: "One-to-many announcements" },
      ],
      phase: DETAILS_PHASE,
    },
  },
  {
    id: "notifyChannels",
    after: "coreFeature",
    when: (a) => has(a, "coreFeature", "notification"),
    question: {
      id: "notifyChannels",
      label: "Notifications",
      question: "How should people be notified?",
      hint: "Drives the notification delivery setup.",
      reassure: "Pick up to 2 — in-app is the simplest start.",
      options: ["In-app", "Email", "Push", "SMS"],
      multiSelect: true,
      maxSelect: 2,
      phase: DETAILS_PHASE,
    },
  },
  {
    id: "searchScope",
    after: "coreFeature",
    when: (a) => has(a, "coreFeature", "search"),
    question: {
      id: "searchScope",
      label: "Search",
      question: "How should search work?",
      hint: "Defines the indexing approach.",
      options: [
        { label: "Simple keyword", description: "Match words in fields" },
        { label: "Filters & facets", description: "Narrow by attributes" },
        { label: "Full-text", description: "Search inside long content" },
        { label: "Smart / semantic", description: "Understands meaning" },
      ],
      phase: DETAILS_PHASE,
    },
  },
];

// ─── The dynamic list builder ────────────────────────────────────────────────────

function insertAfter(
  list: StepDef[],
  afterId: string,
  items: StepDef[],
): StepDef[] {
  const i = list.findIndex((s) => s.id === afterId);
  if (i < 0) return [...list, ...items];
  return [...list.slice(0, i + 1), ...items, ...list.slice(i + 1)];
}

/** Base questions to remove when an earlier answer makes them irrelevant. */
const REMOVE_RULES: {
  when: (a: Answers, d: Domain) => boolean;
  ids: string[];
}[] = [
  {
    // Headless API tools have no front-end look or navigation.
    when: (a) => str(a, "appType").includes("api"),
    ids: ["styleDirection", "navigation"],
  },
  {
    // A personal tool for one person doesn't need a "scale" answer.
    when: (a) => has(a, "audience", "just me"),
    ids: ["scale"],
  },
];

/**
 * Given the base question list and the answers so far, return the dynamic,
 * domain-aware question list. Inserts domain questions and any triggered
 * branch questions, and removes base questions an answer has made irrelevant.
 * Recompute this after every answer.
 */
export function augmentQuestions(base: StepDef[], answers: Answers): StepDef[] {
  const domain = inferDomain(answers);
  let list = [...base];

  const domainQs = DOMAIN_QUESTIONS[domain] ?? [];
  if (domainQs.length > 0) {
    list = insertAfter(list, "secondaryFeatures", domainQs);
  }

  for (const rule of BRANCH_RULES) {
    if (rule.when(answers, domain)) {
      list = insertAfter(list, rule.after, [rule.question]);
    }
  }

  // Remove now-irrelevant base questions (but never one already answered).
  const removed = new Set<string>();
  for (const r of REMOVE_RULES) {
    if (r.when(answers, domain)) {
      for (const id of r.ids) if (!answers[id]) removed.add(id);
    }
  }
  if (removed.size > 0) list = list.filter((s) => !removed.has(s.id));

  // De-dupe by id (defensive — keep first occurrence).
  const seen = new Set<string>();
  return list.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}

// ─── Labels for the spec engine ──────────────────────────────────────────────────
// Maps every domain/branch question id → its short label, so the spec engine can
// render the deeper answers as a "Specifics" section without hardcoding each key.

export const EXTRA_QUESTION_LABELS: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const qs of Object.values(DOMAIN_QUESTIONS)) {
    for (const q of qs) out[q.id] = q.label;
  }
  for (const rule of BRANCH_RULES) {
    if (rule.question.id !== "domainHint") {
      out[rule.question.id] = rule.question.label;
    }
  }
  return out;
})();
