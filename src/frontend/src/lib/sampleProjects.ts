import type {
  AppArtifact,
  AppUpdateEntry,
  CreatorProfile,
  MarketApp,
  Project,
} from "@/types";
import { SortBy } from "@/types";
import { SEED_PROJECTS } from "./seedProjects";

// Canonical project seed lives in ./seedProjects (single source of truth).
// Re-exported here so existing importers (backend localFallback, ProjectDetailPage)
// keep their import path while the data no longer diverges from the store.
export const SAMPLE_PROJECTS: Project[] = SEED_PROJECTS;

export const SAMPLE_CREATORS: CreatorProfile[] = [
  {
    id: "creator-mia",
    name: "Mia Thornton",
    bio: "Indie maker building calm productivity tools. Former UX lead at Notion. Focused on minimal interfaces that respect attention.",
    joinedAt: "2023-11-15",
    totalClones: 148,
    totalApps: 1,
    verified: true,
    badges: ["verified-creator", "rising-star"],
  },
  {
    id: "creator-james",
    name: "James Okafor",
    bio: "Full-stack developer and consultant for independent service professionals. Building reliable scheduling infrastructure since 2022.",
    joinedAt: "2023-08-22",
    totalClones: 312,
    totalApps: 1,
    verified: true,
    badges: ["verified-creator", "original-thinker"],
  },
  {
    id: "creator-caffeine",
    name: "Caffeine Templates",
    bio: "Official template library by the Caffeine team. Production-ready starting points for every common app category.",
    joinedAt: "2023-01-01",
    totalClones: 3783,
    totalApps: 5,
    verified: true,
    badges: ["verified-creator", "top-builder", "clone-milestone-1k"],
  },
  {
    id: "creator-priya",
    name: "priya.dev",
    bio: "Computer science student and community builder. Remixing templates for education and student life.",
    joinedAt: "2024-09-10",
    totalClones: 44,
    totalApps: 1,
    verified: false,
    badges: ["rising-star"],
  },
];

export const MARKET_APPS: MarketApp[] = [
  // --- Original apps (built from scratch by real users) ---
  {
    id: "market-1",
    name: "Taskflow",
    author: "Mia Thornton",
    creatorId: "creator-mia",
    description:
      "A focused personal task manager for makers who want calm, distraction-free daily planning with minimal setup and no subscriptions.",
    tags: ["original", "verified"],
    category: "Tracker",
    features: [
      "Daily focus view",
      "Recurring tasks",
      "Priority labels",
      "Quick capture",
      "Weekly review",
    ],
    colorDirection: "Calm Blue",
    vibe: "Calm / Minimal",
    audience: "Solo makers & indie workers",
    icon: "CheckSquare",
    iconColor: "oklch(0.70 0.12 260)",
    cloneCount: 148,
    downloadCount: 148,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.70 0.12 260), oklch(0.60 0.18 280))",
    provenance: "original",
    publishedAt: "2024-09-12",
    rating: 4.6,
    usedByCount: 142,
    price: 0,
    priceType: "free",
    updateAvailable: false,
    lastUpdated: Date.now() - 7 * 86400000,
    updateFrequency: "Weekly",
    updates: [
      {
        version: "1.4.0",
        date: "2025-11-01",
        summary: "Added recurring tasks with flexible intervals",
        breaking: false,
      },
      {
        version: "1.3.0",
        date: "2025-08-15",
        summary: "Weekly review screen with reflection prompts",
        breaking: false,
      },
      {
        version: "1.2.0",
        date: "2025-05-20",
        summary: "Priority labels and colour coding",
        breaking: false,
      },
      {
        version: "1.1.0",
        date: "2025-02-10",
        summary: "Quick capture from any screen",
        breaking: false,
      },
      {
        version: "1.0.0",
        date: "2024-09-12",
        summary: "Initial release — daily focus view and basic tasks",
        breaking: false,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Task Export (CSV)",
        type: "data-export",
        description: "Export all tasks to spreadsheet",
        thumbnail:
          "linear-gradient(135deg, oklch(0.70 0.12 260), oklch(0.60 0.18 280))",
        qualityScore: 92,
        generatedDate: "2025-11-02",
      },
      {
        name: "Weekly Summary Report",
        type: "report",
        description: "Auto-generated weekly productivity report",
        thumbnail:
          "linear-gradient(135deg, oklch(0.65 0.10 240), oklch(0.55 0.14 220))",
        qualityScore: 88,
        generatedDate: "2025-11-03",
      },
      {
        name: "Focus Score Card",
        type: "certificate",
        description: "Your focus performance badge",
        thumbnail:
          "linear-gradient(135deg, oklch(0.80 0.08 260), oklch(0.70 0.12 280))",
        qualityScore: 95,
        generatedDate: "2025-11-03",
      },
    ] as AppArtifact[],
  },
  {
    id: "market-2",
    name: "BookEase",
    author: "James Okafor",
    creatorId: "creator-james",
    description:
      "A straightforward appointment booking system for independent service providers — therapists, coaches, and consultants who need reliable scheduling without the bloat.",
    tags: ["original", "verified"],
    category: "Booking",
    features: [
      "Calendar availability",
      "Client self-booking",
      "Automated reminders",
      "Buffer time rules",
      "Service types & durations",
      "Missed appointment tracking",
    ],
    colorDirection: "Warm Amber",
    vibe: "Warm / Friendly",
    audience: "Independent service professionals",
    icon: "CalendarCheck",
    iconColor: "oklch(0.75 0.15 145)",
    cloneCount: 312,
    downloadCount: 312,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.75 0.15 145), oklch(0.65 0.20 165))",
    provenance: "original",
    publishedAt: "2024-11-03",
    rating: 4.8,
    usedByCount: 298,
    price: 12,
    priceType: "onetime",
    updateAvailable: false,
    lastUpdated: Date.now() - 14 * 86400000,
    updateFrequency: "Monthly",
    updates: [
      {
        version: "2.3.0",
        date: "2025-10-01",
        summary: "Buffer time rules between appointments",
        breaking: false,
      },
      {
        version: "2.2.0",
        date: "2025-07-14",
        summary: "Missed appointment tracking and follow-up prompts",
        breaking: false,
      },
      {
        version: "2.1.0",
        date: "2025-04-22",
        summary: "Automated SMS reminders via email gateway",
        breaking: true,
      },
      {
        version: "2.0.0",
        date: "2025-01-10",
        summary: "Rebuilt calendar engine — improved conflict detection",
        breaking: true,
      },
      {
        version: "1.0.0",
        date: "2024-11-03",
        summary: "Initial release — client self-booking and calendar",
        breaking: false,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Booking Analytics Report",
        type: "report",
        description: "Monthly booking volume and no-show rates",
        thumbnail:
          "linear-gradient(135deg, oklch(0.75 0.15 145), oklch(0.65 0.20 165))",
        qualityScore: 91,
        generatedDate: "2025-11-01",
      },
      {
        name: "Client List (CSV)",
        type: "data-export",
        description: "Full client directory export",
        thumbnail:
          "linear-gradient(135deg, oklch(0.70 0.12 130), oklch(0.60 0.16 150))",
        qualityScore: 85,
        generatedDate: "2025-11-01",
      },
      {
        name: "Service Catalogue PDF",
        type: "document",
        description: "Printable service menu for reception desk",
        thumbnail:
          "linear-gradient(135deg, oklch(0.80 0.10 145), oklch(0.70 0.14 165))",
        qualityScore: 89,
        generatedDate: "2025-10-30",
      },
      {
        name: "Provider Schedule Card",
        type: "certificate",
        description: "Printable weekly schedule for practitioners",
        thumbnail:
          "linear-gradient(135deg, oklch(0.85 0.06 145), oklch(0.75 0.10 165))",
        qualityScore: 87,
        generatedDate: "2025-11-02",
      },
    ] as AppArtifact[],
  },
  // --- Template apps (starting points that need specialization) ---
  {
    id: "market-3",
    name: "ContentBase",
    author: "Caffeine Templates",
    creatorId: "creator-caffeine",
    description:
      "A clean CMS template for editorial teams and independent publishers. Covers content pipeline, asset management, and scheduled publishing — ready to specialise for your niche.",
    tags: ["original"],
    category: "Content / CMS",
    features: [
      "Content pipeline & drafts",
      "Asset library",
      "Scheduled publishing",
      "Category organisation",
      "Author management",
    ],
    colorDirection: "Soft Slate",
    vibe: "Serious / Professional",
    audience: "Editorial teams & independent publishers",
    icon: "FileText",
    iconColor: "oklch(0.65 0.10 70)",
    cloneCount: 521,
    downloadCount: 521,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.65 0.10 70), oklch(0.55 0.14 50))",
    provenance: "original",
    publishedAt: "2024-07-18",
    rating: 4.5,
    usedByCount: 487,
    price: 0,
    priceType: "free",
    updateAvailable: false,
    lastUpdated: Date.now() - 30 * 86400000,
    updateFrequency: "Monthly",
    updates: [
      {
        version: "3.1.0",
        date: "2025-10-15",
        summary: "Author management with role-based publishing",
        breaking: false,
      },
      {
        version: "3.0.0",
        date: "2025-07-01",
        summary: "Scheduled publishing with timezone support",
        breaking: true,
      },
      {
        version: "2.1.0",
        date: "2025-04-10",
        summary: "Asset library with tagging and search",
        breaking: false,
      },
      {
        version: "2.0.0",
        date: "2025-01-20",
        summary: "Content pipeline redesign",
        breaking: true,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Content Audit Report",
        type: "report",
        description: "Published vs draft content overview",
        thumbnail:
          "linear-gradient(135deg, oklch(0.65 0.10 70), oklch(0.55 0.14 50))",
        qualityScore: 84,
        generatedDate: "2025-11-01",
      },
      {
        name: "Asset Library Export",
        type: "data-export",
        description: "Full asset index with metadata",
        thumbnail:
          "linear-gradient(135deg, oklch(0.60 0.08 70), oklch(0.50 0.12 50))",
        qualityScore: 80,
        generatedDate: "2025-11-01",
      },
      {
        name: "Editorial Calendar PDF",
        type: "document",
        description: "Upcoming scheduled content calendar",
        thumbnail:
          "linear-gradient(135deg, oklch(0.70 0.06 70), oklch(0.60 0.10 50))",
        qualityScore: 90,
        generatedDate: "2025-10-31",
      },
    ] as AppArtifact[],
  },
  {
    id: "market-4",
    name: "MarketLaunch",
    author: "Caffeine Templates",
    creatorId: "creator-caffeine",
    description:
      "A two-sided marketplace template covering listings, search, checkout, and seller dashboards. Specialise the category — physical goods, services, digital products — and it's ready to spec.",
    tags: ["original", "verified"],
    category: "Marketplace",
    features: [
      "Buyer & seller accounts",
      "Listing management",
      "Search & filters",
      "Checkout flow",
      "Seller dashboard & payouts",
      "Review & rating system",
    ],
    colorDirection: "Bold Indigo",
    vibe: "Bold / Energetic",
    audience: "Platform builders",
    icon: "ShoppingBag",
    iconColor: "oklch(0.68 0.14 310)",
    cloneCount: 874,
    downloadCount: 874,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.68 0.14 310), oklch(0.58 0.18 290))",
    provenance: "original",
    publishedAt: "2024-06-01",
    rating: 4.9,
    usedByCount: 821,
    price: 29,
    priceType: "onetime",
    updateAvailable: false,
    lastUpdated: Date.now() - 3 * 86400000,
    updateFrequency: "Weekly",
    updates: [
      {
        version: "4.2.0",
        date: "2025-11-08",
        summary: "Seller payout dashboard with transaction history",
        breaking: false,
      },
      {
        version: "4.1.0",
        date: "2025-09-25",
        summary: "Review and rating system for buyers",
        breaking: false,
      },
      {
        version: "4.0.0",
        date: "2025-06-01",
        summary: "Checkout flow overhaul with multi-currency support",
        breaking: true,
      },
      {
        version: "3.1.0",
        date: "2025-03-15",
        summary: "Advanced search filters and faceted navigation",
        breaking: false,
      },
      {
        version: "3.0.0",
        date: "2024-12-01",
        summary: "Two-sided account system launch",
        breaking: true,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Marketplace Performance Report",
        type: "report",
        description: "GMV, conversion rates, and top sellers",
        thumbnail:
          "linear-gradient(135deg, oklch(0.68 0.14 310), oklch(0.58 0.18 290))",
        qualityScore: 96,
        generatedDate: "2025-11-09",
      },
      {
        name: "Seller Directory (CSV)",
        type: "data-export",
        description: "Full seller list with ratings and sales",
        thumbnail:
          "linear-gradient(135deg, oklch(0.63 0.12 310), oklch(0.53 0.16 290))",
        qualityScore: 88,
        generatedDate: "2025-11-09",
      },
      {
        name: "Platform Health Dashboard",
        type: "dashboard-snapshot",
        description: "Real-time metrics snapshot",
        thumbnail:
          "linear-gradient(135deg, oklch(0.73 0.10 310), oklch(0.63 0.14 290))",
        qualityScore: 93,
        generatedDate: "2025-11-09",
      },
      {
        name: "Payout Summary PDF",
        type: "document",
        description: "Monthly payout breakdown for finance",
        thumbnail:
          "linear-gradient(135deg, oklch(0.78 0.08 310), oklch(0.68 0.12 290))",
        qualityScore: 91,
        generatedDate: "2025-11-08",
      },
    ] as AppArtifact[],
  },
  {
    id: "market-5",
    name: "CircleSpace",
    author: "Caffeine Templates",
    creatorId: "creator-caffeine",
    description:
      "A community platform template for clubs, neighbourhoods, and interest groups. Covers events, forums, member directory, and moderation — specialise the name, audience, and features.",
    tags: ["original"],
    category: "Community",
    features: [
      "Event calendar & RSVP",
      "Discussion boards",
      "Member directory",
      "Announcements",
      "Community management",
    ],
    colorDirection: "Muted Teal",
    vibe: "Warm / Friendly",
    audience: "Community organisers",
    icon: "Users",
    iconColor: "oklch(0.75 0.15 145)",
    cloneCount: 396,
    downloadCount: 396,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.75 0.15 145), oklch(0.65 0.20 165))",
    provenance: "original",
    publishedAt: "2024-08-22",
    rating: 4.4,
    usedByCount: 361,
    price: 0,
    priceType: "free",
    updateAvailable: false,
    lastUpdated: Date.now() - 60 * 86400000,
    updateFrequency: "Quarterly",
    updates: [
      {
        version: "2.0.0",
        date: "2025-08-15",
        summary: "Community management and moderation tools",
        breaking: true,
      },
      {
        version: "1.2.0",
        date: "2025-05-10",
        summary: "Member directory with profile pages",
        breaking: false,
      },
      {
        version: "1.1.0",
        date: "2025-02-20",
        summary: "Announcements pinning and email digest",
        breaking: false,
      },
      {
        version: "1.0.0",
        date: "2024-08-22",
        summary: "Initial release — events and discussion boards",
        breaking: false,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Community Activity Report",
        type: "report",
        description: "Events, RSVPs, and engagement summary",
        thumbnail:
          "linear-gradient(135deg, oklch(0.75 0.15 145), oklch(0.65 0.20 165))",
        qualityScore: 82,
        generatedDate: "2025-11-01",
      },
      {
        name: "Member Directory (CSV)",
        type: "data-export",
        description: "Full member list with join dates",
        thumbnail:
          "linear-gradient(135deg, oklch(0.70 0.12 145), oklch(0.60 0.16 165))",
        qualityScore: 78,
        generatedDate: "2025-11-01",
      },
      {
        name: "Event Calendar PDF",
        type: "document",
        description: "Upcoming events for print display",
        thumbnail:
          "linear-gradient(135deg, oklch(0.80 0.08 145), oklch(0.70 0.12 165))",
        qualityScore: 86,
        generatedDate: "2025-10-28",
      },
    ] as AppArtifact[],
  },
  // --- White-label apps (fully specced shells for resellers and agencies) ---
  {
    id: "market-6",
    name: "SaaS Shell",
    author: "Caffeine Templates",
    creatorId: "creator-caffeine",
    description:
      "A fully specced multi-tenant SaaS dashboard shell — auth, org management, billing, and settings already defined. Drop in your core feature and the scaffolding is done.",
    tags: ["original", "verified"],
    category: "Dashboard",
    features: [
      "Multiple organisations",
      "Different access levels",
      "Billing & plan management",
      "Settings & profile",
      "Notification centre",
      "Usage insights",
    ],
    colorDirection: "Deep Charcoal",
    vibe: "Serious / Professional",
    audience: "SaaS builders & agencies",
    icon: "LayoutDashboard",
    iconColor: "oklch(0.65 0.10 70)",
    cloneCount: 1203,
    downloadCount: 1203,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.65 0.10 70), oklch(0.55 0.14 50))",
    provenance: "original",
    publishedAt: "2024-05-14",
    rating: 4.9,
    usedByCount: 1087,
    price: 49,
    priceType: "subscription",
    updateAvailable: false,
    lastUpdated: Date.now() - 90 * 86400000,
    updateFrequency: "Quarterly",
    updates: [
      {
        version: "5.1.0",
        date: "2025-08-01",
        summary: "Usage insights dashboard with per-organisation breakdown",
        breaking: false,
      },
      {
        version: "5.0.0",
        date: "2025-05-15",
        summary:
          "Multi-tenant isolation overhaul — breaking changes to org API",
        breaking: true,
      },
      {
        version: "4.2.0",
        date: "2025-02-10",
        summary: "Notification centre with digest emails",
        breaking: false,
      },
      {
        version: "4.1.0",
        date: "2024-11-20",
        summary: "Billing plan management and upgrade flow",
        breaking: false,
      },
      {
        version: "4.0.0",
        date: "2024-08-01",
        summary: "Settings redesign with profile management",
        breaking: true,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Organisation Usage Report",
        type: "report",
        description: "Per-org usage metrics and plan utilisation",
        thumbnail:
          "linear-gradient(135deg, oklch(0.65 0.10 70), oklch(0.55 0.14 50))",
        qualityScore: 94,
        generatedDate: "2025-11-01",
      },
      {
        name: "Billing Summary PDF",
        type: "document",
        description: "Monthly billing breakdown per organisation",
        thumbnail:
          "linear-gradient(135deg, oklch(0.60 0.08 70), oklch(0.50 0.12 50))",
        qualityScore: 90,
        generatedDate: "2025-11-01",
      },
      {
        name: "User Access Audit",
        type: "certificate",
        description: "Access control audit for compliance",
        thumbnail:
          "linear-gradient(135deg, oklch(0.70 0.06 70), oklch(0.60 0.10 50))",
        qualityScore: 97,
        generatedDate: "2025-10-31",
      },
    ] as AppArtifact[],
  },
  {
    id: "market-7",
    name: "ClientPortal",
    author: "Caffeine Templates",
    creatorId: "creator-caffeine",
    description:
      "A white-label client portal for agencies and consultancies. Covers project status, file sharing, invoices, and messaging — brand it as your own and hand it to your clients.",
    tags: ["original"],
    category: "Internal Tool",
    features: [
      "Project status board",
      "File sharing & approvals",
      "Invoice & payment tracking",
      "Client messaging",
      "Milestone tracker",
    ],
    colorDirection: "Warm Sand",
    vibe: "Calm / Minimal",
    audience: "Agencies & consultancies",
    icon: "Briefcase",
    iconColor: "oklch(0.70 0.12 260)",
    cloneCount: 689,
    downloadCount: 689,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.70 0.12 260), oklch(0.60 0.18 280))",
    provenance: "original",
    publishedAt: "2024-10-05",
    rating: 4.7,
    usedByCount: 634,
    price: 19,
    priceType: "onetime",
    updateAvailable: false,
    lastUpdated: Date.now() - 21 * 86400000,
    updateFrequency: "Monthly",
    updates: [
      {
        version: "3.2.0",
        date: "2025-10-20",
        summary: "Milestone tracker with progress visualisation",
        breaking: false,
      },
      {
        version: "3.1.0",
        date: "2025-07-05",
        summary: "Client messaging with file attachments",
        breaking: false,
      },
      {
        version: "3.0.0",
        date: "2025-04-01",
        summary: "Invoice and payment tracking module",
        breaking: true,
      },
      {
        version: "2.0.0",
        date: "2025-01-15",
        summary: "File sharing and approval workflows",
        breaking: true,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Project Status Report",
        type: "report",
        description: "Client-facing project progress overview",
        thumbnail:
          "linear-gradient(135deg, oklch(0.70 0.12 260), oklch(0.60 0.18 280))",
        qualityScore: 89,
        generatedDate: "2025-11-01",
      },
      {
        name: "Invoice Bundle PDF",
        type: "document",
        description: "All outstanding invoices for a client",
        thumbnail:
          "linear-gradient(135deg, oklch(0.65 0.10 260), oklch(0.55 0.14 280))",
        qualityScore: 92,
        generatedDate: "2025-11-01",
      },
      {
        name: "File Approval Log",
        type: "certificate",
        description: "Audit trail of approved/rejected files",
        thumbnail:
          "linear-gradient(135deg, oklch(0.75 0.08 260), oklch(0.65 0.12 280))",
        qualityScore: 95,
        generatedDate: "2025-10-30",
      },
    ] as AppArtifact[],
  },
  // --- Cloned app (derived from a template, republished by another user) ---
  {
    id: "market-8",
    name: "StudyCircle",
    author: "priya.dev",
    creatorId: "creator-priya",
    description:
      "A study-group community platform cloned from CircleSpace and specialised for student cohorts — forums, study sessions, resource library, and peer accountability tracking.",
    tags: ["remixed"],
    category: "Community",
    features: [
      "Study session scheduling",
      "Discussion boards",
      "Resource library",
      "Study partner matching",
      "Progress check-ins",
    ],
    colorDirection: "Muted Teal",
    vibe: "Warm / Friendly",
    audience: "Student cohorts & study groups",
    icon: "GraduationCap",
    iconColor: "oklch(0.68 0.14 310)",
    cloneCount: 44,
    downloadCount: 44,
    screenshotGradient:
      "linear-gradient(135deg, oklch(0.68 0.14 310), oklch(0.58 0.18 290))",
    provenance: "remixed",
    publishedAt: "2025-01-08",
    rating: 3.9,
    usedByCount: 37,
    price: 8,
    priceType: "subscription",
    updateAvailable: true,
    lastUpdated: Date.now() - 45 * 86400000,
    updateFrequency: "Monthly",
    updates: [
      {
        version: "1.3.0",
        date: "2025-10-01",
        summary: "Progress check-in reminders with spaced repetition",
        breaking: false,
      },
      {
        version: "1.2.0",
        date: "2025-07-20",
        summary: "Study partner matching algorithm",
        breaking: false,
      },
      {
        version: "1.1.0",
        date: "2025-04-15",
        summary: "Resource library with category tags",
        breaking: false,
      },
      {
        version: "1.0.0",
        date: "2025-01-08",
        summary: "Initial release — study sessions and discussion boards",
        breaking: false,
      },
    ] as AppUpdateEntry[],
    artifacts: [
      {
        name: "Study Progress Report",
        type: "report",
        description: "Individual and cohort learning progress",
        thumbnail:
          "linear-gradient(135deg, oklch(0.68 0.14 310), oklch(0.58 0.18 290))",
        qualityScore: 83,
        generatedDate: "2025-11-01",
      },
      {
        name: "Session History (CSV)",
        type: "data-export",
        description: "All study sessions with duration and topics",
        thumbnail:
          "linear-gradient(135deg, oklch(0.63 0.12 310), oklch(0.53 0.16 290))",
        qualityScore: 77,
        generatedDate: "2025-11-01",
      },
      {
        name: "Cohort Performance Badge",
        type: "certificate",
        description: "Top-performer recognition badge",
        thumbnail:
          "linear-gradient(135deg, oklch(0.78 0.10 310), oklch(0.68 0.14 290))",
        qualityScore: 88,
        generatedDate: "2025-10-31",
      },
    ] as AppArtifact[],
  },
];

export function getSortedProjects(
  projects: Project[],
  sortBy: SortBy | "burn-rate",
): Project[] {
  return [...projects].sort((a, b) => {
    switch (sortBy) {
      case SortBy.name:
        return a.name.localeCompare(b.name);
      case SortBy.createdAt:
        return Number(b.createdAt - a.createdAt);
      case SortBy.priority: {
        const order = { high: 0, medium: 1, low: 2, undefined: 3 };
        return (
          (order[a.metadata.priority ?? "undefined"] ?? 3) -
          (order[b.metadata.priority ?? "undefined"] ?? 3)
        );
      }
      case "burn-rate": {
        const aLive =
          a.metadata.maturity === "live" || a.deploymentStatus === "live";
        const bLive =
          b.metadata.maturity === "live" || b.deploymentStatus === "live";
        if (aLive && bLive) return (b.burnRate ?? 0) - (a.burnRate ?? 0);
        if (aLive) return -1;
        if (bLive) return 1;
        return 0;
      }
      default:
        return Number(b.updatedAt - a.updatedAt);
    }
  });
}
