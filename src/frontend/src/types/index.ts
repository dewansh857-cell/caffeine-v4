// Backend types re-exported with local aliases
export type {
  Project as _Project,
  ProjectMetadata,
  ProjectVersion,
  SpecSection,
  UIState,
  OrganizeFilters,
  MetadataUpdate,
  ProjectId,
  Timestamp,
} from "@/backend";

import type { Project as BackendProject, SpecSection } from "@/backend";

// Extend Project with burn-rate fields (not in backend.d.ts)
// Extended Project fields not in backend.d.ts
export type VerificationStatus = "unverified" | "verified" | "pending";

export type MarketStatus = "published" | "cloned" | "draft";

export interface ProjectExtraFields {
  color?: string;
  description?: string;
  tags?: string[];
  caffeineVersion?: string;
  linesOfCode?: number;
  fileCount?: number;
  marketAvailable?: boolean;
  cloneCount?: number;
  /** Verification status — 'verified' = fully checked, 'pending' = in review, 'unverified' = not checked */
  verificationStatus?: VerificationStatus;
  marketStatus?: MarketStatus;
  updateCount?: number;
  health?: "healthy" | "needs-attention" | "at-risk";
  teamSize?: number;
  region?: string;
  burnRateTrend?: "up" | "down" | "stable";
  /** Simulated market rating (1–5) */
  rating?: number;
  /** Simulated download/clone count for market distribution */
  downloads?: number;
  /** Market provenance — how this project originated */
  provenance?: "original" | "cloned" | "remixed";
  /** Build status — separate from deployment status */
  buildStatus?: "live" | "deploying" | "failed" | "notDeployed";
  /** Priority flag for the Projects card view */
  priority?: "high" | "medium" | "low" | "none";
  /** Draft completion percentage (0–100) for the Projects card view */
  draftCompletion?: number;
  /** Team member initials for avatar display */
  teamMembers?: string[];
}

export interface ProjectBurnRate {
  burnRate?: number;
  burnRateBaseline?: number;
  burnRateStatus?: BurnRateStatus;
}

// ─── Localization ──────────────────────────────────────────────────────────
export type SupportedLocale = "en" | "pt" | "es" | "fr" | "de" | "ja" | "zh";

export const SUPPORTED_LOCALES: { id: SupportedLocale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "pt", label: "Português" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "ja", label: "日本語" },
  { id: "zh", label: "简体中文" },
];

// ─── Safe customization layer (cloned apps) ─────────────────────────────────
export interface CustomizationConfig {
  appName: string;
  brandColor: string;
  theme: "light" | "dark" | "system";
  locale: SupportedLocale;
}

// ─── Creator update tracking (cloned apps) ─────────────────────────────────
export interface PendingUpdate {
  version: string;
  timestamp: number;
  changeSummary: string;
  newFeatures: string[];
  changedSections: string[];
  fixes: string[];
}

export interface ProjectUpdateTracking {
  creatorUpdateAvailable: boolean;
  lastCreatorUpdate: number | null;
  updateConflict: boolean;
  pendingUpdate: PendingUpdate | null;
}

export type Project = BackendProject &
  ProjectExtraFields &
  ProjectBurnRate &
  ProjectBurnRate &
  Partial<ProjectUpdateTracking> & {
    customizationConfig?: CustomizationConfig;
    isSample?: boolean;
  };

export {
  AppCategory,
  BuilderMode,
  SortBy,
} from "@/backend";

// Enums not directly exposed as named exports in backend.d.ts
export type Priority = "low" | "medium" | "high";
export type Maturity = "idea" | "exploring" | "defining" | "building" | "live";
export type DeploymentStatus = "notDeployed" | "deploying" | "live" | "failed";
export type BurnRateStatus = "normal" | "elevated" | "critical";

// Market
export type MarketAppTag = "original" | "cloned" | "remixed" | "verified";

export interface CreatorProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  totalClones: number;
  totalApps: number;
  verified: boolean;
  badges: BuilderBadge[];
}

export type BuilderBadge =
  | "verified-creator"
  | "top-builder"
  | "original-thinker"
  | "community-favorite"
  | "rising-star"
  | "clone-milestone-1k"
  | "clone-milestone-10k";

export const BADGE_LABELS: Record<BuilderBadge, string> = {
  "verified-creator": "Verified Creator",
  "top-builder": "Top Builder",
  "original-thinker": "Original Thinker",
  "community-favorite": "Community Favorite",
  "rising-star": "Rising Star",
  "clone-milestone-1k": "1K Clones",
  "clone-milestone-10k": "10K Clones",
};

export const BADGE_COLORS: Record<BuilderBadge, string> = {
  "verified-creator": "#3b82f6",
  "top-builder": "#f59e0b",
  "original-thinker": "#8b5cf6",
  "community-favorite": "#ec4899",
  "rising-star": "#10b981",
  "clone-milestone-1k": "#06b6d4",
  "clone-milestone-10k": "#f97316",
};

// ---- Customization layer types ----

export interface BrandCustomization {
  logo?: string;
  primaryColor?: string;
  domain?: string;
}

export interface ContentCustomization {
  fields: Record<string, string>; // key -> editable text value
  sectionToggles: Record<string, boolean>; // section id -> enabled
}

export interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
}

export interface IntegrationCustomization {
  stripe?: string;
  email?: string;
  analytics?: string;
}

export interface ProjectCustomizationLayer {
  brand: BrandCustomization;
  content: ContentCustomization;
  features: FeatureFlag[];
  integrations: IntegrationCustomization;
}

// ---- Update subscription ----

export interface UpdateSubscription {
  subscribed: boolean;
  subscribedAt: string;
  autoUpdate: boolean;
}

// ---- Market app changelog entry ----

export interface AppUpdateEntry {
  version: string;
  date: string;
  summary: string;
  breaking: boolean;
}

// ---- Market app artifact/product ----

export interface AppArtifact {
  name: string;
  type: string;
  description: string;
  thumbnail: string;
  qualityScore: number;
  generatedDate: string;
}

export interface MarketApp {
  id: string;
  name: string;
  author: string;
  creatorId: string;
  description: string;
  tags: MarketAppTag[];
  category: string;
  features: string[];
  colorDirection: string;
  vibe: string;
  audience: string;
  icon: string;
  iconColor: string;
  cloneCount: number;
  publishedAt: string;
  rating: number;
  usedByCount: number;
  downloadCount?: number;
  screenshotGradient?: string;
  screenshot?: string;
  provenance?: string;
  specSections?: SpecSection[];
  lastUpdated: number; // epoch ms
  updateFrequency: "Weekly" | "Monthly" | "Quarterly";
  /** Price in USD, or 0 for free */
  price?: number;
  /** Pricing model */
  priceType?: "free" | "onetime" | "subscription";
  /** Changelog entries for this app */
  updates?: AppUpdateEntry[];
  /** Artifacts/products generated by this app */
  artifacts?: AppArtifact[];
  /** Whether an update is available for this cloned app */
  updateAvailable?: boolean;
  /** Whether the app is verified by the platform */
  verified?: boolean;
}

// Specialization flow (clone → make it yours)
export type SpecializationStep =
  | "rename"
  | "audience"
  | "features"
  | "branding"
  | "complete";

export interface SpecializationState {
  sourceApp: MarketApp;
  currentStep: SpecializationStep;
  name: string;
  audience: string;
  selectedFeatures: string[];
  colorDirection: string;
  vibe: string;
}

// Dev mode — role-switching preview within a draft
export interface DevModeState {
  enabled: boolean;
  selectedRole: string;
}

// Design flow answers for the 18-step visual spec flow
export interface DesignFlowAnswers {
  // Phase 6 — Look & feel (unified style direction)
  styleDirection?: string;
  // Derived from styleDirection, or set explicitly in optional Refine visuals
  colorDirection?: string;
  typographyFeel?: string;
  cornerDensity?: string;
  // Phase 5 — Ownership & trust
  dataOwnership?: string;
  // Phase 1 — What are you making?
  appType?: string;
  audience?: string[];
  closestExample?: string;
  // Phase 2 — The feel (derived from styleDirection, or set in optional Refine visuals)
  vibe?: string;
  // Phase 3 — The shape (derived from styleDirection, or set in optional Refine visuals)
  shellLayout?: string;
  headerFooterPlacement?: string;
  lightDarkDefault?: string;
  // Phase 4 — What it does
  appScope?: string; // 'mvp' | 'full' — controls feature depth and data model step
  coreFeatures?: string[];
  rolesAccess?: string[];
  keyScreens?: string[];
  // Phase 5 — Specifics
  dataContent?: string[];
  dataEntities?: string[];
  workflows?: string[];
  nonFunctional?: string[];
  motionRegister?: string;
  platformScope?: string;
  // Phase 8 — Review (no answer needed, just display)
  projectName?: string;
  // Landing screen design (inserted between shape and features phases)
  landingLayoutPattern?: string;
  landingHeroContentType?: string;
  landingHeadlineTone?: string;
  landingCTAStyle?: string;
}

// Build history entry for Develop mode
export interface BuildHistoryEntry {
  version: number;
  prompt: string;
  timestamp: number;
}

// Build simulation state for Develop mode
export interface DevelopBuildState {
  buildVersion: number;
  lastPrompt: string | null;
  isBuilding: boolean;
  buildHistory: BuildHistoryEntry[];
  buildProgress: number; // 0-100
  lastBuildSuccess: boolean;
  selectedHistoryIndex: number | null;
  showHistory: boolean;
}

// Icon color palette for project icons
export const ICON_COLORS = [
  { id: "teal", label: "Teal", value: "#4DB6AC" },
  { id: "violet", label: "Violet", value: "#9575CD" },
  { id: "amber", label: "Amber", value: "#FFB300" },
  { id: "rose", label: "Rose", value: "#E57373" },
  { id: "sky", label: "Sky", value: "#4FC3F7" },
  { id: "emerald", label: "Emerald", value: "#66BB6A" },
  { id: "orange", label: "Orange", value: "#FF7043" },
] as const;

export type IconColorId = (typeof ICON_COLORS)[number]["id"];

// Hub types
export interface HubNode {
  projectId: string;
  x: number;
  y: number;
}

export interface HubConnection {
  from: string;
  to: string;
}

export interface Hub {
  id: string;
  name: string;
  color: string;
  projectIds: string[];
  nodes: HubNode[];
  connections: HubConnection[];
}

// Chat message
export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  timestamp: number;
  actionChip?: { actionId: string; label: string };
}
