// Simulated per-project data: features, workflows, products, builds, team, activity

export interface ProjectFeature {
  id: string;
  category: "Core" | "UI/UX" | "Integrations" | "Analytics";
  icon: string;
  name: string;
  description: string;
  status: "Active" | "In Progress" | "Planned" | "Deprecated";
  priority: "high" | "medium" | "low";
  completionPercent: number;
  dependencies: string[];
}

export interface WorkflowStep {
  label: string;
  icon?: string;
  type?: "Entry" | "Action" | "Decision" | "Exit";
  description?: string;
}

export interface ProjectWorkflow {
  id: string;
  name: string;
  userRole: string;
  steps: WorkflowStep[];
  duration: string;
}

export interface ProjectProduct {
  id: string;
  icon: string;
  name: string;
  type: "Report" | "Certificate" | "Invoice" | "Card" | "Export" | "Dashboard";
  generatedDate: string;
  qualityScore: number;
  fileSize: string;
  status: "Generated" | "Pending" | "Failed";
  completeness: number;
  accuracy: number;
  formatCompliance: number;
  sourceData: string[];
  versions: string[];
  previewType:
    | "report"
    | "certificate"
    | "invoice"
    | "card"
    | "export"
    | "dashboard";
}

export interface BuildEntry {
  version: string;
  date: string;
  status: "Success" | "Failed";
  linesChanged: number;
  prompt: string;
  duration: string;
  testPassRate?: number;
  changes?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  joined: string;
  lastActive: string;
  initials: string;
  color: string;
  weeklyActivity?: number[];
}

export interface ActivityEvent {
  icon: string;
  description: string;
  timestamp: string;
  type: "build" | "deploy" | "update" | "team" | "market";
}

export interface CostEntry {
  month: string;
  amount: number;
}

export interface ProjectDetailData {
  features: ProjectFeature[];
  workflows: ProjectWorkflow[];
  products: ProjectProduct[];
  builds: BuildEntry[];
  team: TeamMember[];
  activity: ActivityEvent[];
  costs: CostEntry[];
  runwayMonths: number;
  budgetAlertPct: number;
}

const DATA: Record<string, ProjectDetailData> = {
  "proj-1": {
    budgetAlertPct: 80,
    activity: [
      {
        icon: "Rocket",
        description: "Deployed v1.2 — Scheduling engine v2",
        timestamp: "Jun 1, 2026",
        type: "deploy",
      },
      {
        icon: "GitMerge",
        description: "Build #18 completed successfully",
        timestamp: "May 28, 2026",
        type: "build",
      },
      {
        icon: "Users",
        description: "Dr. Patel joined as Clinical Admin",
        timestamp: "May 20, 2026",
        type: "team",
      },
      {
        icon: "Store",
        description: "Published to App Market — 47 clones",
        timestamp: "Apr 15, 2026",
        type: "market",
      },
      {
        icon: "GitMerge",
        description: "Build #12 — Patient portal improvements",
        timestamp: "Mar 10, 2026",
        type: "build",
      },
    ],
    features: [
      {
        id: "f1",
        category: "Core",
        icon: "Calendar",
        name: "Appointment Scheduling",
        description:
          "Drag-and-drop calendar for booking patient appointments with conflict detection and double-booking prevention.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f2",
        category: "Core",
        icon: "User",
        name: "Patient Records",
        description:
          "Comprehensive patient profiles with medical history, notes, documents, and allergy tracking.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f3",
        category: "Core",
        icon: "FileText",
        name: "Billing & Invoicing",
        description:
          "Generate invoices, process payments, and track outstanding balances per patient.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Patient Records"],
      },
      {
        id: "f4",
        category: "Core",
        icon: "Bell",
        name: "Appointment Reminders",
        description:
          "Automated SMS and email reminders sent 24h and 1h before each scheduled appointment.",
        status: "Active",
        priority: "medium",
        completionPercent: 100,
        dependencies: ["Appointment Scheduling"],
      },
      {
        id: "f5",
        category: "UI/UX",
        icon: "Layout",
        name: "Patient Portal",
        description:
          "Self-service portal for patients to book, reschedule, and view their appointment history.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Appointment Scheduling", "Patient Records"],
      },
      {
        id: "f6",
        category: "UI/UX",
        icon: "BarChart2",
        name: "Practice Dashboard",
        description:
          "Real-time overview of daily schedule, revenue, and key patient metrics for staff.",
        status: "Active",
        priority: "medium",
        completionPercent: 100,
        dependencies: ["Patient Records", "Billing & Invoicing"],
      },
      {
        id: "f7",
        category: "Integrations",
        icon: "Zap",
        name: "EHR Integration",
        description:
          "Bidirectional sync with popular Electronic Health Record systems including Epic and Cerner.",
        status: "In Progress",
        priority: "high",
        completionPercent: 55,
        dependencies: ["Patient Records"],
      },
      {
        id: "f8",
        category: "Analytics",
        icon: "TrendingUp",
        name: "Revenue Reports",
        description:
          "Monthly P&L reports, outstanding invoice summaries, and 3-month revenue forecasting.",
        status: "Active",
        priority: "medium",
        completionPercent: 100,
        dependencies: ["Billing & Invoicing"],
      },
      {
        id: "f9",
        category: "Analytics",
        icon: "Activity",
        name: "Patient Flow Analytics",
        description:
          "Wait times, no-show rates, peak hours, and capacity utilization by provider and room.",
        status: "In Progress",
        priority: "low",
        completionPercent: 30,
        dependencies: ["Appointment Scheduling", "Patient Records"],
      },
      {
        id: "f10",
        category: "Integrations",
        icon: "MessageSquare",
        name: "Telehealth Video",
        description:
          "In-app video consultations with session recording, transcription, and HIPAA compliance.",
        status: "Planned",
        priority: "medium",
        completionPercent: 0,
        dependencies: ["Patient Portal", "Appointment Scheduling"],
      },
      {
        id: "f11",
        category: "Core",
        icon: "Shield",
        name: "Legacy Import Tool",
        description:
          "CSV-based patient data migration tool from legacy practice management software.",
        status: "Deprecated",
        priority: "low",
        completionPercent: 100,
        dependencies: [],
      },
    ],
    workflows: [
      {
        id: "w1",
        name: "Book New Appointment",
        userRole: "Patient",
        steps: [
          { label: "Login portal" },
          { label: "Select provider" },
          { label: "Choose time slot" },
          { label: "Confirm booking" },
          { label: "Receive confirmation" },
        ],
        duration: "~3 min",
      },
      {
        id: "w2",
        name: "New Patient Registration",
        userRole: "Receptionist",
        steps: [
          { label: "Enter patient info" },
          { label: "Upload insurance" },
          { label: "Set preferences" },
          { label: "Schedule first appt" },
          { label: "Send welcome email" },
        ],
        duration: "~8 min",
      },
      {
        id: "w3",
        name: "Generate Monthly Invoice",
        userRole: "Billing Admin",
        steps: [
          { label: "Select period" },
          { label: "Review line items" },
          { label: "Apply adjustments" },
          { label: "Preview invoice" },
          { label: "Send to patient" },
        ],
        duration: "~5 min",
      },
      {
        id: "w4",
        name: "End-of-Day Summary",
        userRole: "Physician",
        steps: [
          { label: "View patient list" },
          { label: "Complete notes" },
          { label: "Flag follow-ups" },
          { label: "Submit summary" },
        ],
        duration: "~15 min",
      },
    ],
    products: [
      {
        id: "p1",
        icon: "FileText",
        name: "Patient Invoice #2847",
        type: "Invoice",
        generatedDate: "Jun 5, 2026",
        qualityScore: 96,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 98,
        accuracy: 97,
        formatCompliance: 93,
        sourceData: ["Appointment data", "Insurance records", "Service codes"],
        versions: ["v1.0", "v1.1"],
        previewType: "invoice",
      },
      {
        id: "p2",
        icon: "BarChart2",
        name: "May 2026 Revenue Report",
        type: "Report",
        generatedDate: "Jun 1, 2026",
        qualityScore: 91,
        fileSize: "2.1 MB",
        status: "Generated",
        completeness: 95,
        accuracy: 90,
        formatCompliance: 88,
        sourceData: ["Billing records", "Appointment logs"],
        versions: ["v1.0"],
        previewType: "report",
      },
      {
        id: "p3",
        icon: "Award",
        name: "HIPAA Compliance Certificate",
        type: "Certificate",
        generatedDate: "Mar 15, 2026",
        qualityScore: 100,
        fileSize: "0.3 MB",
        status: "Generated",
        completeness: 100,
        accuracy: 100,
        formatCompliance: 100,
        sourceData: ["Security audit", "Policy docs"],
        versions: ["v1.0"],
        previewType: "certificate",
      },
      {
        id: "p4",
        icon: "Layout",
        name: "Practice Overview Dashboard",
        type: "Dashboard",
        generatedDate: "Jun 8, 2026",
        qualityScore: 88,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 90,
        accuracy: 89,
        formatCompliance: 85,
        sourceData: ["All patient data", "Appointment history"],
        versions: ["v1.0", "v2.0"],
        previewType: "dashboard",
      },
      {
        id: "p5",
        icon: "Download",
        name: "Patient Records Export",
        type: "Export",
        generatedDate: "May 20, 2026",
        qualityScore: 78,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 80,
        accuracy: 79,
        formatCompliance: 75,
        sourceData: ["Patient database"],
        versions: ["v1.0"],
        previewType: "export",
      },
    ],
    builds: [
      {
        version: "v1.2",
        date: "Jun 1, 2026",
        status: "Success",
        linesChanged: 820,
        prompt:
          "Rebuild scheduling engine with conflict detection and double-booking prevention",
        duration: "4m 12s",
        testPassRate: 94,
        changes: [
          "Improved navigation responsiveness",
          "Fixed auth redirect loop",
          "Added dark mode toggle",
          "Updated onboarding copy",
        ],
      },
      {
        version: "v1.1",
        date: "Mar 10, 2026",
        status: "Success",
        linesChanged: 340,
        prompt: "Improve patient portal UI and add self-service rescheduling",
        duration: "2m 55s",
        testPassRate: 88,
        changes: [
          "Improved navigation responsiveness",
          "Patient portal redesign",
          "Self-service rescheduling flow",
        ],
      },
      {
        version: "v1.0",
        date: "Jan 15, 2026",
        status: "Success",
        linesChanged: 3420,
        prompt:
          "Initial build: appointment scheduling, patient records, billing module",
        duration: "9m 40s",
        testPassRate: 76,
        changes: [
          "Initial appointment scheduling",
          "Patient records module",
          "Billing and invoicing",
        ],
      },
    ],
    team: [
      {
        name: "Sarah Chen",
        role: "Product Owner",
        joined: "Jan 15, 2026",
        lastActive: "Jun 8, 2026",
        initials: "SC",
        color: "#0d9488",
        weeklyActivity: [3, 5, 2, 8, 6, 4, 7],
      },
      {
        name: "Marcus Webb",
        role: "Lead Developer",
        joined: "Jan 15, 2026",
        lastActive: "Jun 7, 2026",
        initials: "MW",
        color: "#2563eb",
        weeklyActivity: [5, 7, 6, 8, 9, 6, 8],
      },
      {
        name: "Dr. Priya Patel",
        role: "Clinical Admin",
        joined: "May 20, 2026",
        lastActive: "Jun 6, 2026",
        initials: "PP",
        color: "#7c3aed",
        weeklyActivity: [2, 3, 4, 3, 5, 4, 6],
      },
    ],
    costs: [
      { month: "Jan", amount: 280 },
      { month: "Feb", amount: 295 },
      { month: "Mar", amount: 310 },
      { month: "Apr", amount: 325 },
      { month: "May", amount: 338 },
      { month: "Jun", amount: 340 },
    ],
    runwayMonths: 18,
  },

  "proj-2": {
    budgetAlertPct: 72,
    activity: [
      {
        icon: "GitMerge",
        description: "Build #9 completed — Events feature",
        timestamp: "Apr 20, 2026",
        type: "build",
      },
      {
        icon: "Users",
        description: "Community Manager role added for Alex Torres",
        timestamp: "Apr 5, 2026",
        type: "team",
      },
      {
        icon: "Rocket",
        description: "Deployed v1.1 to production",
        timestamp: "Apr 20, 2026",
        type: "deploy",
      },
      {
        icon: "Store",
        description: "Listed on App Market — 12 clones",
        timestamp: "Mar 1, 2026",
        type: "market",
      },
    ],
    features: [
      {
        id: "f1",
        category: "Core",
        icon: "MessageSquare",
        name: "Discussion Threads",
        description:
          "Threaded conversations with upvoting, nested replies, tagging, and rich text formatting.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f2",
        category: "Core",
        icon: "Users",
        name: "Member Profiles",
        description:
          "Public profiles with bios, contribution history, badges, and follow functionality.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f3",
        category: "Core",
        icon: "Calendar",
        name: "Event Management",
        description:
          "Create, RSVP, and manage local neighborhood events with attendance tracking.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Member Profiles"],
      },
      {
        id: "f4",
        category: "Core",
        icon: "Bell",
        name: "Notifications",
        description:
          "Real-time push alerts for replies, mentions, nearby events, and moderation actions.",
        status: "Active",
        priority: "medium",
        completionPercent: 100,
        dependencies: ["Discussion Threads", "Event Management"],
      },
      {
        id: "f5",
        category: "UI/UX",
        icon: "MapIcon",
        name: "Local Newsfeed",
        description:
          "Location-filtered feed of posts, events, and announcements relevant to your area.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Discussion Threads", "Event Management"],
      },
      {
        id: "f6",
        category: "Analytics",
        icon: "BarChart2",
        name: "Engagement Analytics",
        description:
          "Post views, active member counts, peak engagement hours, and retention trend charts.",
        status: "In Progress",
        priority: "medium",
        completionPercent: 45,
        dependencies: ["Discussion Threads", "Member Profiles"],
      },
      {
        id: "f7",
        category: "Integrations",
        icon: "Globe",
        name: "Social Sharing",
        description:
          "Share posts and events to external social platforms with auto-generated preview cards.",
        status: "Planned",
        priority: "low",
        completionPercent: 0,
        dependencies: ["Discussion Threads"],
      },
      {
        id: "f8",
        category: "Core",
        icon: "ShieldCheck",
        name: "Content Moderation",
        description:
          "AI-assisted content moderation with a human review queue and appeal workflow.",
        status: "Planned",
        priority: "high",
        completionPercent: 10,
        dependencies: ["Discussion Threads", "Member Profiles"],
      },
      {
        id: "f9",
        category: "UI/UX",
        icon: "MapIcon",
        name: "Map Integration v1",
        description:
          "First-generation map overlay for events; replaced by Local Newsfeed geo-filtering.",
        status: "Deprecated",
        priority: "low",
        completionPercent: 100,
        dependencies: [],
      },
    ],
    workflows: [
      {
        id: "w1",
        name: "Post to Community",
        userRole: "Member",
        steps: [
          { label: "Write post" },
          { label: "Add tags/media" },
          { label: "Choose audience" },
          { label: "Publish" },
          { label: "Receive reactions" },
        ],
        duration: "~2 min",
      },
      {
        id: "w2",
        name: "Create Local Event",
        userRole: "Organizer",
        steps: [
          { label: "Set event details" },
          { label: "Add location" },
          { label: "Invite members" },
          { label: "Publish event" },
          { label: "Track RSVPs" },
        ],
        duration: "~5 min",
      },
      {
        id: "w3",
        name: "Moderate Flagged Content",
        userRole: "Moderator",
        steps: [
          { label: "Review flags" },
          { label: "Assess content" },
          { label: "Take action" },
          { label: "Notify user" },
        ],
        duration: "~3 min",
      },
    ],
    products: [
      {
        id: "p1",
        icon: "BarChart2",
        name: "Monthly Engagement Report",
        type: "Report",
        generatedDate: "Jun 1, 2026",
        qualityScore: 83,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 85,
        accuracy: 84,
        formatCompliance: 80,
        sourceData: ["Post data", "Member activity", "Event attendance"],
        versions: ["v1.0"],
        previewType: "report",
      },
      {
        id: "p2",
        icon: "Users",
        name: "Member Directory Export",
        type: "Export",
        generatedDate: "May 28, 2026",
        qualityScore: 90,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 92,
        accuracy: 91,
        formatCompliance: 87,
        sourceData: ["Member profiles"],
        versions: ["v1.0"],
        previewType: "export",
      },
      {
        id: "p3",
        icon: "Award",
        name: "Top Contributor Cards",
        type: "Card",
        generatedDate: "Jun 5, 2026",
        qualityScore: 87,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 89,
        accuracy: 88,
        formatCompliance: 84,
        sourceData: ["Post counts", "Reaction data"],
        versions: ["v1.0"],
        previewType: "card",
      },
      {
        id: "p4",
        icon: "Layout",
        name: "Community Dashboard",
        type: "Dashboard",
        generatedDate: "Jun 8, 2026",
        qualityScore: 79,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 82,
        accuracy: 80,
        formatCompliance: 75,
        sourceData: ["All metrics"],
        versions: ["v1.0"],
        previewType: "dashboard",
      },
    ],
    builds: [
      {
        version: "v1.1",
        date: "Apr 20, 2026",
        status: "Success",
        linesChanged: 640,
        prompt:
          "Add events module with RSVP tracking and recurring event support",
        duration: "3m 30s",
        testPassRate: 91,
        changes: [
          "Improved navigation responsiveness",
          "Events RSVP module",
          "Recurring event support",
          "Fixed auth redirect loop",
        ],
      },
      {
        version: "v1.0",
        date: "Feb 10, 2026",
        status: "Success",
        linesChanged: 5100,
        prompt:
          "Initial build: discussion threads, member profiles, local newsfeed",
        duration: "11m 20s",
        testPassRate: 82,
        changes: ["Discussion threads", "Member profiles", "Local newsfeed"],
      },
    ],
    team: [
      {
        name: "Jordan Kim",
        role: "Product Owner",
        joined: "Feb 10, 2026",
        lastActive: "Jun 7, 2026",
        initials: "JK",
        color: "#7c3aed",
        weeklyActivity: [4, 6, 3, 7, 5, 6, 8],
      },
      {
        name: "Alex Torres",
        role: "Community Manager",
        joined: "Apr 5, 2026",
        lastActive: "Jun 6, 2026",
        initials: "AT",
        color: "#0d9488",
        weeklyActivity: [2, 4, 5, 3, 6, 4, 5],
      },
    ],
    costs: [
      { month: "Feb", amount: 400 },
      { month: "Mar", amount: 440 },
      { month: "Apr", amount: 480 },
      { month: "May", amount: 510 },
      { month: "Jun", amount: 520 },
    ],
    runwayMonths: 12,
  },

  "proj-3": {
    budgetAlertPct: 72,
    activity: [
      {
        icon: "GitMerge",
        description: "Build #4 — Security hardening pass",
        timestamp: "May 20, 2026",
        type: "build",
      },
      {
        icon: "Users",
        description: "Legal Review team added",
        timestamp: "Apr 10, 2026",
        type: "team",
      },
      {
        icon: "GitMerge",
        description: "Build #1 — Initial draft spec",
        timestamp: "Mar 5, 2026",
        type: "build",
      },
    ],
    features: [
      {
        id: "f1",
        category: "Core",
        icon: "Lock",
        name: "Encrypted Document Vault",
        description:
          "AES-256 encrypted storage for sensitive legal documents with client-side key management.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f2",
        category: "Core",
        icon: "FileText",
        name: "Version Control",
        description:
          "Track all document revisions with full diff view, restore to any version, and change authorship.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Encrypted Document Vault"],
      },
      {
        id: "f3",
        category: "Core",
        icon: "Users",
        name: "Access Control",
        description:
          "Granular role-based permissions with attorney-client privilege levels and time-limited access grants.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Encrypted Document Vault"],
      },
      {
        id: "f4",
        category: "Core",
        icon: "Search",
        name: "Document Search",
        description:
          "Full-text search across all vault contents with filters by type, date, owner, and classification.",
        status: "In Progress",
        priority: "high",
        completionPercent: 60,
        dependencies: ["Encrypted Document Vault", "Access Control"],
      },
      {
        id: "f5",
        category: "Core",
        icon: "FileText",
        name: "Audit Trail",
        description:
          "Immutable, tamper-proof log of all document access, edits, downloads, and export events.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Access Control"],
      },
      {
        id: "f6",
        category: "Integrations",
        icon: "Zap",
        name: "E-Signature Integration",
        description:
          "Native e-signature workflow with DocuSign compatibility and legal enforceability.",
        status: "Planned",
        priority: "high",
        completionPercent: 5,
        dependencies: ["Encrypted Document Vault", "Access Control"],
      },
      {
        id: "f7",
        category: "Analytics",
        icon: "Shield",
        name: "Compliance Dashboard",
        description:
          "Real-time compliance posture view with automated GDPR, SOC2, and HIPAA status tracking.",
        status: "In Progress",
        priority: "medium",
        completionPercent: 40,
        dependencies: ["Audit Trail"],
      },
      {
        id: "f8",
        category: "Integrations",
        icon: "Globe",
        name: "Legacy FTP Sync",
        description:
          "Automated FTP-based document ingestion from legacy systems; migrated to API-based import.",
        status: "Deprecated",
        priority: "low",
        completionPercent: 100,
        dependencies: [],
      },
    ],
    workflows: [
      {
        id: "w1",
        name: "Upload Secure Document",
        userRole: "Attorney",
        steps: [
          { label: "Select document" },
          { label: "Set classification" },
          { label: "Assign access" },
          { label: "Encrypt & store" },
          { label: "Notify recipients" },
        ],
        duration: "~4 min",
      },
      {
        id: "w2",
        name: "Request Document Access",
        userRole: "Client",
        steps: [
          { label: "Search records" },
          { label: "Submit request" },
          { label: "Attorney approves" },
          { label: "Download document" },
        ],
        duration: "~2 min",
      },
      {
        id: "w3",
        name: "Generate Audit Report",
        userRole: "Compliance Officer",
        steps: [
          { label: "Set date range" },
          { label: "Select event types" },
          { label: "Generate report" },
          { label: "Export PDF" },
        ],
        duration: "~3 min",
      },
    ],
    products: [
      {
        id: "p1",
        icon: "FileText",
        name: "Q1 2026 Audit Report",
        type: "Report",
        generatedDate: "Apr 1, 2026",
        qualityScore: 94,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 96,
        accuracy: 95,
        formatCompliance: 91,
        sourceData: ["Audit log", "Access records"],
        versions: ["v1.0"],
        previewType: "report",
      },
      {
        id: "p2",
        icon: "Award",
        name: "SOC2 Compliance Certificate",
        type: "Certificate",
        generatedDate: "Feb 28, 2026",
        qualityScore: 100,
        fileSize: "0.5 MB",
        status: "Generated",
        completeness: 100,
        accuracy: 100,
        formatCompliance: 100,
        sourceData: ["Security audit", "Control testing"],
        versions: ["v1.0"],
        previewType: "certificate",
      },
      {
        id: "p3",
        icon: "Download",
        name: "Document Manifest Export",
        type: "Export",
        generatedDate: "May 15, 2026",
        qualityScore: 88,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 90,
        accuracy: 89,
        formatCompliance: 85,
        sourceData: ["Document index"],
        versions: ["v1.0"],
        previewType: "export",
      },
    ],
    builds: [
      {
        version: "v0.2",
        date: "May 20, 2026",
        status: "Success",
        linesChanged: 1200,
        prompt:
          "Security hardening: add audit trail, access control, and encryption at rest",
        duration: "5m 15s",
        testPassRate: 97,
        changes: [
          "Improved navigation responsiveness",
          "Audit trail implementation",
          "Access control hardening",
          "Encryption at rest",
        ],
      },
      {
        version: "v0.1",
        date: "Mar 5, 2026",
        status: "Success",
        linesChanged: 7800,
        prompt:
          "Initial build: document vault structure, version control, basic access roles",
        duration: "14m 30s",
        testPassRate: 79,
        changes: [
          "Document vault structure",
          "Version control system",
          "Basic access roles",
        ],
      },
    ],
    team: [
      {
        name: "Elena Vasquez",
        role: "Product Owner",
        joined: "Mar 5, 2026",
        lastActive: "Jun 5, 2026",
        initials: "EV",
        color: "#ea580c",
        weeklyActivity: [3, 5, 2, 8, 6, 4, 7],
      },
      {
        name: "James Okafor",
        role: "Security Engineer",
        joined: "Mar 10, 2026",
        lastActive: "Jun 4, 2026",
        initials: "JO",
        color: "#1d4ed8",
        weeklyActivity: [6, 7, 5, 9, 8, 7, 6],
      },
    ],
    costs: [
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 0 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 0 },
    ],
    runwayMonths: 0,
  },

  "proj-4": {
    budgetAlertPct: 72,
    activity: [
      {
        icon: "GitMerge",
        description: "Build #7 — Core task CRUD complete",
        timestamp: "May 10, 2026",
        type: "build",
      },
      {
        icon: "GitMerge",
        description: "Build #2 — Initial wireframe implemented",
        timestamp: "Mar 20, 2026",
        type: "build",
      },
      {
        icon: "Users",
        description: "Product Designer joined the team",
        timestamp: "Apr 1, 2026",
        type: "team",
      },
    ],
    features: [
      {
        id: "f1",
        category: "Core",
        icon: "CheckSquare",
        name: "Task Management",
        description:
          "Create, assign, and track tasks with due dates, priority labels, and custom fields.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f2",
        category: "Core",
        icon: "Layout",
        name: "Kanban Boards",
        description:
          "Visual drag-and-drop workflow boards with configurable columns and WIP limits.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Task Management"],
      },
      {
        id: "f3",
        category: "Core",
        icon: "Users",
        name: "Team Workspaces",
        description:
          "Shared project workspaces with role-based access controls and visibility settings per team.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f4",
        category: "Core",
        icon: "Zap",
        name: "Automation Rules",
        description:
          "Trigger automated actions — assign, move, notify — based on task status changes and deadlines.",
        status: "In Progress",
        priority: "high",
        completionPercent: 65,
        dependencies: ["Task Management", "Team Workspaces"],
      },
      {
        id: "f5",
        category: "UI/UX",
        icon: "Calendar",
        name: "Calendar View",
        description:
          "Timeline and calendar overlay with drag-to-reschedule and milestone markers.",
        status: "In Progress",
        priority: "medium",
        completionPercent: 50,
        dependencies: ["Task Management"],
      },
      {
        id: "f6",
        category: "Analytics",
        icon: "BarChart2",
        name: "Productivity Reports",
        description:
          "Velocity charts, burndown reports, and team performance summaries per sprint.",
        status: "In Progress",
        priority: "medium",
        completionPercent: 35,
        dependencies: ["Task Management", "Team Workspaces"],
      },
      {
        id: "f7",
        category: "Integrations",
        icon: "Zap",
        name: "Slack Integration",
        description:
          "Post real-time task updates, deadline reminders, and standup summaries to Slack channels.",
        status: "Planned",
        priority: "medium",
        completionPercent: 0,
        dependencies: ["Task Management"],
      },
      {
        id: "f8",
        category: "UI/UX",
        icon: "Layout",
        name: "Simple List View v1",
        description:
          "Original flat list view replaced by Kanban and Calendar; retained for data migration.",
        status: "Deprecated",
        priority: "low",
        completionPercent: 100,
        dependencies: [],
      },
    ],
    workflows: [
      {
        id: "w1",
        name: "Create and Assign Task",
        userRole: "Manager",
        steps: [
          { label: "Create task" },
          { label: "Set priority" },
          { label: "Assign member" },
          { label: "Set due date" },
          { label: "Notify assignee" },
        ],
        duration: "~1 min",
      },
      {
        id: "w2",
        name: "Daily Standup Review",
        userRole: "Team Lead",
        steps: [
          { label: "View in-progress" },
          { label: "Check blockers" },
          { label: "Update statuses" },
          { label: "Log standup notes" },
        ],
        duration: "~10 min",
      },
      {
        id: "w3",
        name: "Sprint Planning",
        userRole: "Product Manager",
        steps: [
          { label: "Review backlog" },
          { label: "Estimate tasks" },
          { label: "Assign to sprint" },
          { label: "Set sprint goal" },
          { label: "Notify team" },
        ],
        duration: "~45 min",
      },
    ],
    products: [
      {
        id: "p1",
        icon: "BarChart2",
        name: "Sprint Velocity Report",
        type: "Report",
        generatedDate: "Jun 5, 2026",
        qualityScore: 85,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 87,
        accuracy: 86,
        formatCompliance: 82,
        sourceData: ["Sprint data", "Task completions"],
        versions: ["v1.0"],
        previewType: "report",
      },
      {
        id: "p2",
        icon: "Download",
        name: "Task Export CSV",
        type: "Export",
        generatedDate: "Jun 6, 2026",
        qualityScore: 95,
        fileSize: "0.8 MB",
        status: "Generated",
        completeness: 97,
        accuracy: 96,
        formatCompliance: 92,
        sourceData: ["Task database"],
        versions: ["v1.0"],
        previewType: "export",
      },
      {
        id: "p3",
        icon: "Layout",
        name: "Team Performance Dashboard",
        type: "Dashboard",
        generatedDate: "Jun 7, 2026",
        qualityScore: 80,
        fileSize: "1.4 MB",
        status: "Pending",
        completeness: 82,
        accuracy: 81,
        formatCompliance: 77,
        sourceData: ["All task metrics"],
        versions: [],
        previewType: "dashboard",
      },
    ],
    builds: [
      {
        version: "v0.2",
        date: "May 10, 2026",
        status: "Success",
        linesChanged: 2100,
        prompt:
          "Implement core task CRUD, kanban board, and team workspace views",
        duration: "6m 50s",
        testPassRate: 90,
        changes: [
          "Improved navigation responsiveness",
          "Task CRUD operations",
          "Kanban board view",
          "Team workspace setup",
        ],
      },
      {
        version: "v0.1",
        date: "Mar 20, 2026",
        status: "Success",
        linesChanged: 4200,
        prompt:
          "Initial wireframe: task list, basic assignment, simple status flow",
        duration: "10m 10s",
        testPassRate: 83,
        changes: [
          "Task list wireframe",
          "Basic assignment flow",
          "Status management",
        ],
      },
    ],
    team: [
      {
        name: "Lena Park",
        role: "Product Manager",
        joined: "Mar 20, 2026",
        lastActive: "Jun 8, 2026",
        initials: "LP",
        color: "#2563eb",
        weeklyActivity: [3, 5, 2, 8, 6, 4, 7],
      },
      {
        name: "David Nkosi",
        role: "Product Designer",
        joined: "Apr 1, 2026",
        lastActive: "Jun 7, 2026",
        initials: "DN",
        color: "#7c3aed",
        weeklyActivity: [4, 3, 6, 5, 7, 4, 6],
      },
    ],
    costs: [
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 0 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 0 },
    ],
    runwayMonths: 0,
  },

  "proj-5": {
    budgetAlertPct: 72,
    activity: [
      {
        icon: "GitMerge",
        description: "Build #3 — Catalog and search implemented",
        timestamp: "May 15, 2026",
        type: "build",
      },
      {
        icon: "GitMerge",
        description: "Build #1 — Spec scaffolding",
        timestamp: "Apr 12, 2026",
        type: "build",
      },
    ],
    features: [
      {
        id: "f1",
        category: "Core",
        icon: "BookOpen",
        name: "Book Catalog",
        description:
          "Browse and search the full library catalog with filters by genre, author, subject, and real-time availability.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f2",
        category: "Core",
        icon: "Calendar",
        name: "Reservation System",
        description:
          "Reserve books online with flexible pickup date selection, multi-branch support, and waitlist management.",
        status: "Active",
        priority: "high",
        completionPercent: 100,
        dependencies: ["Book Catalog"],
      },
      {
        id: "f3",
        category: "Core",
        icon: "Bell",
        name: "Due Date Reminders",
        description:
          "Automated email and SMS notifications when items are due for return or holds become available.",
        status: "In Progress",
        priority: "medium",
        completionPercent: 70,
        dependencies: ["Reservation System"],
      },
      {
        id: "f4",
        category: "UI/UX",
        icon: "User",
        name: "Patron Portal",
        description:
          "Self-service account dashboard with checkout history, active holds, renewals, and fines management.",
        status: "In Progress",
        priority: "high",
        completionPercent: 55,
        dependencies: ["Book Catalog", "Reservation System"],
      },
      {
        id: "f5",
        category: "Analytics",
        icon: "BarChart2",
        name: "Circulation Reports",
        description:
          "Insights on most borrowed titles, peak checkout times, overdue rates, and collection health scores.",
        status: "Planned",
        priority: "medium",
        completionPercent: 0,
        dependencies: ["Reservation System"],
      },
      {
        id: "f6",
        category: "Integrations",
        icon: "Zap",
        name: "ISBN Barcode Scanner",
        description:
          "Mobile camera barcode scanning for fast staff check-in and check-out workflows.",
        status: "Planned",
        priority: "low",
        completionPercent: 0,
        dependencies: ["Book Catalog"],
      },
      {
        id: "f7",
        category: "Integrations",
        icon: "Globe",
        name: "Inter-Library Loan API",
        description:
          "Automated requests to partner libraries for titles not available in local collection.",
        status: "Planned",
        priority: "medium",
        completionPercent: 0,
        dependencies: ["Book Catalog", "Reservation System"],
      },
    ],
    workflows: [
      {
        id: "w1",
        name: "Reserve a Book",
        userRole: "Patron",
        steps: [
          { label: "Search catalog" },
          { label: "Check availability" },
          { label: "Reserve" },
          { label: "Get confirmation" },
          { label: "Collect at desk" },
        ],
        duration: "~2 min",
      },
      {
        id: "w2",
        name: "Process Book Return",
        userRole: "Librarian",
        steps: [
          { label: "Scan book" },
          { label: "Check condition" },
          { label: "Update status" },
          { label: "Notify waitlist" },
        ],
        duration: "~1 min",
      },
      {
        id: "w3",
        name: "Monthly Collection Review",
        userRole: "Head Librarian",
        steps: [
          { label: "Run circulation report" },
          { label: "Identify low-usage" },
          { label: "Order new titles" },
          { label: "Export acquisition list" },
        ],
        duration: "~30 min",
      },
    ],
    products: [
      {
        id: "p1",
        icon: "FileText",
        name: "Booking Confirmation",
        type: "Certificate",
        generatedDate: "Jun 6, 2026",
        qualityScore: 92,
        fileSize: "0.4 MB",
        status: "Generated",
        completeness: 94,
        accuracy: 93,
        formatCompliance: 89,
        sourceData: ["Reservation data", "Patron info"],
        versions: ["v1.0"],
        previewType: "certificate",
      },
      {
        id: "p2",
        icon: "FileText",
        name: "Monthly Circulation Report",
        type: "Report",
        generatedDate: "Jun 1, 2026",
        qualityScore: 75,
        fileSize: "1.4 MB",
        status: "Pending",
        completeness: 77,
        accuracy: 76,
        formatCompliance: 72,
        sourceData: ["Checkout logs"],
        versions: [],
        previewType: "report",
      },
      {
        id: "p3",
        icon: "Download",
        name: "Catalog Export",
        type: "Export",
        generatedDate: "May 30, 2026",
        qualityScore: 89,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 91,
        accuracy: 90,
        formatCompliance: 86,
        sourceData: ["Book catalog database"],
        versions: ["v1.0"],
        previewType: "export",
      },
    ],
    builds: [
      {
        version: "v0.2",
        date: "May 15, 2026",
        status: "Success",
        linesChanged: 1600,
        prompt:
          "Add book catalog, search with filters, and basic reservation flow",
        duration: "4m 45s",
        testPassRate: 92,
        changes: [
          "Improved navigation responsiveness",
          "Book catalog with filters",
          "Reservation flow",
          "Search functionality",
        ],
      },
      {
        version: "v0.1",
        date: "Apr 12, 2026",
        status: "Success",
        linesChanged: 2800,
        prompt:
          "Initial spec scaffolding: patron accounts, catalog model, reservation schema",
        duration: "7m 20s",
        testPassRate: 80,
        changes: ["Patron accounts", "Catalog model", "Reservation schema"],
      },
    ],
    team: [
      {
        name: "Mia Johnson",
        role: "Project Lead",
        joined: "Apr 12, 2026",
        lastActive: "Jun 5, 2026",
        initials: "MJ",
        color: "#d97706",
        weeklyActivity: [3, 5, 2, 8, 6, 4, 7],
      },
    ],
    costs: [
      { month: "Apr", amount: 0 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 0 },
    ],
    runwayMonths: 0,
  },

  "proj-6": {
    budgetAlertPct: 70,
    activity: [
      {
        icon: "GitMerge",
        description: "Build #5 — AI recommendation engine scaffold",
        timestamp: "Jun 8, 2026",
        type: "build",
      },
      {
        icon: "Users",
        description: "AI Engineer joined the team",
        timestamp: "May 15, 2026",
        type: "team",
      },
      {
        icon: "GitMerge",
        description: "Build #1 — Concept spec",
        timestamp: "May 1, 2026",
        type: "build",
      },
    ],
    features: [
      {
        id: "f1",
        category: "Core",
        icon: "Zap",
        name: "AI Content Discovery",
        description:
          "Machine-learning recommendation engine that surfaces relevant content based on reading behavior and interests.",
        status: "In Progress",
        priority: "high",
        completionPercent: 50,
        dependencies: [],
      },
      {
        id: "f2",
        category: "Core",
        icon: "Layout",
        name: "Personalized Feed",
        description:
          "Dynamic home feed with content ranked by real-time user interest signals and recency.",
        status: "In Progress",
        priority: "high",
        completionPercent: 60,
        dependencies: ["AI Content Discovery"],
      },
      {
        id: "f3",
        category: "Core",
        icon: "Star",
        name: "Content Collections",
        description:
          "Curate and organize saved content into named, shareable collections with custom ordering.",
        status: "Active",
        priority: "medium",
        completionPercent: 100,
        dependencies: [],
      },
      {
        id: "f4",
        category: "UI/UX",
        icon: "Search",
        name: "Semantic Search",
        description:
          "Natural language search that understands user intent beyond keyword matching using embeddings.",
        status: "Planned",
        priority: "high",
        completionPercent: 10,
        dependencies: ["AI Content Discovery"],
      },
      {
        id: "f5",
        category: "Analytics",
        icon: "BarChart2",
        name: "Interest Graph",
        description:
          "Visual interactive map showing clusters of user interests and content relationship patterns.",
        status: "Planned",
        priority: "medium",
        completionPercent: 0,
        dependencies: ["AI Content Discovery", "Content Collections"],
      },
      {
        id: "f6",
        category: "Integrations",
        icon: "Globe",
        name: "Content Source Connectors",
        description:
          "Automatically ingest content from RSS feeds, newsletters, YouTube channels, and podcast feeds.",
        status: "In Progress",
        priority: "high",
        completionPercent: 40,
        dependencies: [],
      },
      {
        id: "f7",
        category: "UI/UX",
        icon: "Palette",
        name: "Style Guide Export",
        description:
          "Export your personal curation style and taxonomy as a shareable guide for collaborators.",
        status: "Planned",
        priority: "low",
        completionPercent: 0,
        dependencies: ["Content Collections"],
      },
      {
        id: "f8",
        category: "Core",
        icon: "BookOpen",
        name: "Manual Link Bookmarking",
        description:
          "Early manual URL bookmarking feature superseded by automatic Source Connectors ingestion.",
        status: "Deprecated",
        priority: "low",
        completionPercent: 100,
        dependencies: [],
      },
    ],
    workflows: [
      {
        id: "w1",
        name: "Discover Content",
        userRole: "User",
        steps: [
          { label: "Open feed" },
          { label: "Browse recommendations" },
          { label: "Save to collection" },
          { label: "Share or comment" },
        ],
        duration: "~5 min",
      },
      {
        id: "w2",
        name: "Add Content Source",
        userRole: "User",
        steps: [
          { label: "Search source" },
          { label: "Preview content" },
          { label: "Add to feed" },
          { label: "Set priority weight" },
        ],
        duration: "~2 min",
      },
      {
        id: "w3",
        name: "Export Style Guide",
        userRole: "Power User",
        steps: [
          { label: "Select collections" },
          { label: "Choose format" },
          { label: "Preview guide" },
          { label: "Export PDF/JSON" },
        ],
        duration: "~3 min",
      },
    ],
    products: [
      {
        id: "p1",
        icon: "Palette",
        name: "Style Guide Export",
        type: "Export",
        generatedDate: "Jun 7, 2026",
        qualityScore: 82,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 84,
        accuracy: 83,
        formatCompliance: 79,
        sourceData: ["Collections", "User preferences"],
        versions: ["v1.0"],
        previewType: "export",
      },
      {
        id: "p2",
        icon: "Layout",
        name: "Interest Graph Dashboard",
        type: "Dashboard",
        generatedDate: "Jun 8, 2026",
        qualityScore: 71,
        fileSize: "1.4 MB",
        status: "Pending",
        completeness: 74,
        accuracy: 72,
        formatCompliance: 67,
        sourceData: ["Behavior data", "Saved items"],
        versions: [],
        previewType: "dashboard",
      },
      {
        id: "p3",
        icon: "BarChart2",
        name: "Recommendation Quality Report",
        type: "Report",
        generatedDate: "Jun 5, 2026",
        qualityScore: 68,
        fileSize: "1.4 MB",
        status: "Generated",
        completeness: 70,
        accuracy: 69,
        formatCompliance: 65,
        sourceData: ["ML model outputs", "User feedback"],
        versions: ["v1.0"],
        previewType: "report",
      },
    ],
    builds: [
      {
        version: "v0.2",
        date: "Jun 8, 2026",
        status: "Success",
        linesChanged: 2800,
        prompt:
          "Scaffold AI recommendation engine, personalized feed, and content source connectors",
        duration: "8m 20s",
        testPassRate: 86,
        changes: [
          "Improved navigation responsiveness",
          "AI recommendation engine scaffold",
          "Personalized feed",
          "Content source connectors",
        ],
      },
      {
        version: "v0.1",
        date: "May 1, 2026",
        status: "Success",
        linesChanged: 6500,
        prompt:
          "Initial concept spec: AI discovery engine, collections, semantic search design",
        duration: "13m 45s",
        testPassRate: 77,
        changes: [
          "AI discovery engine concept",
          "Collections system",
          "Semantic search design",
        ],
      },
    ],
    team: [
      {
        name: "Raj Sharma",
        role: "Founder",
        joined: "May 1, 2026",
        lastActive: "Jun 8, 2026",
        initials: "RS",
        color: "#16a34a",
        weeklyActivity: [5, 6, 4, 8, 7, 5, 9],
      },
      {
        name: "Yuki Tanaka",
        role: "AI Engineer",
        joined: "May 15, 2026",
        lastActive: "Jun 7, 2026",
        initials: "YT",
        color: "#0891b2",
        weeklyActivity: [3, 5, 7, 6, 8, 7, 9],
      },
    ],
    costs: [
      { month: "May", amount: 0 },
      { month: "Jun", amount: 0 },
    ],
    runwayMonths: 0,
  },
};

export interface ReviewEntry {
  date: string;
  score: number;
  reviewer: string;
  notes: string;
  decisionPaths: DecisionPath[];
  summary: ReviewSummary;
}

export interface DecisionPath {
  aspect: string;
  choice: string;
  outcome: string;
  depth: number;
}

export interface ReviewSummary {
  aspectsReviewed: number;
  improvementsIdentified: number;
  sentToBuilder: number;
}

export interface AnalyzeScore {
  area: string;
  icon: string;
  score: number;
  trend: "up" | "down" | "stable";
  finding: string;
  detail: string;
  fixes: string[];
}

export interface MarketReview {
  author: string;
  initials: string;
  color: string;
  rating: number;
  text: string;
  date: string;
}

export interface ArtifactEntry {
  id: string;
  name: string;
  type: string;
  score: number;
  timestamp: string;
}

export interface TeamActivityEntry {
  action: string;
  member: string;
  time: string;
  type: "add" | "remove" | "role" | "access";
}

export interface ExtendedProjectDetailData extends ProjectDetailData {
  reviewHistory: ReviewEntry[];
  analyzeScores: AnalyzeScore[];
  teamActivity: TeamActivityEntry[];
  marketReviews: MarketReview[];
}

const ANALYZE_SCORES_PROJ1: AnalyzeScore[] = [
  {
    area: "Core Flows",
    icon: "GitMerge",
    score: 88,
    trend: "up",
    finding: "All critical user journeys are complete and tested.",
    detail:
      "Booking, billing, and patient management flows all pass with no dead ends.",
    fixes: [
      "Add confirmation step to cancellation flow",
      "Improve error recovery on booking timeout",
    ],
  },
  {
    area: "Feature Coverage",
    icon: "CheckSquare",
    score: 76,
    trend: "up",
    finding: "EHR integration is 55% complete — blocks some workflows.",
    detail:
      "8 of 11 features are fully active. Telehealth and EHR integration are in progress.",
    fixes: [
      "Complete EHR integration (currently 55%)",
      "Add telehealth video module",
      "Remove deprecated CSV import tool from UI",
    ],
  },
  {
    area: "UI Consistency",
    icon: "Palette",
    score: 82,
    trend: "stable",
    finding: "Minor token drift in billing module detected.",
    detail:
      "Most components use canonical design tokens. Two legacy components use hardcoded colors.",
    fixes: [
      "Replace hardcoded colors in billing module",
      "Audit legacy invoice template for token drift",
    ],
  },
  {
    area: "Performance",
    icon: "Zap",
    score: 71,
    trend: "down",
    finding: "Patient record load time above 600ms on large datasets.",
    detail:
      "Average response time is acceptable, but large patient datasets cause slowdowns.",
    fixes: [
      "Paginate patient record queries",
      "Add index on patient search fields",
      "Cache appointment data for dashboard",
    ],
  },
  {
    area: "Content",
    icon: "BookOpen",
    score: 90,
    trend: "up",
    finding: "All error states have clear guidance text.",
    detail:
      "Content is professional, accurate, and uses plain language throughout.",
    fixes: ["Review automated email copy for tone consistency"],
  },
  {
    area: "Security",
    icon: "Shield",
    score: 95,
    trend: "stable",
    finding: "HIPAA compliance certificate issued. No open vulnerabilities.",
    detail:
      "Data encryption, access controls, and audit logs are all in place.",
    fixes: ["Schedule next compliance audit for Q3"],
  },
  {
    area: "End Products",
    icon: "Award",
    score: 88,
    trend: "up",
    finding: "Invoices and reports meet quality standards.",
    detail:
      "5 artifact types generated. Invoice and certificate quality scores are above 90.",
    fixes: [
      "Improve dashboard export completeness from 90% to 95%",
      "Add version notes to product metadata",
    ],
  },
];

const ANALYZE_SCORES_PROJ2: AnalyzeScore[] = [
  {
    area: "Core Flows",
    icon: "GitMerge",
    score: 78,
    trend: "up",
    finding: "Event RSVP flow has a missing confirmation step.",
    detail:
      "Discussion and member flows are complete. Event management needs a confirm step.",
    fixes: [
      "Add confirmation step to RSVP flow",
      "Handle duplicate RSVP edge case",
    ],
  },
  {
    area: "Feature Coverage",
    icon: "CheckSquare",
    score: 65,
    trend: "down",
    finding: "Moderation tools are planned but not yet implemented.",
    detail:
      "6 of 9 features are active. Moderation, analytics, and safety reports are in progress.",
    fixes: [
      "Implement content moderation queue",
      "Complete engagement analytics (45%)",
      "Add social sharing feature",
    ],
  },
  {
    area: "UI Consistency",
    icon: "Palette",
    score: 80,
    trend: "stable",
    finding: "Feed layout is consistent but card density varies.",
    detail:
      "Navigation and core screens are well-aligned. Feed card padding is inconsistent.",
    fixes: [
      "Normalize feed card padding to 16px",
      "Standardize avatar sizes across views",
    ],
  },
  {
    area: "Performance",
    icon: "Zap",
    score: 68,
    trend: "down",
    finding: "Feed load time spikes at peak hours.",
    detail:
      "Average response time is 320ms but can reach 900ms with high engagement.",
    fixes: [
      "Add feed pagination or virtual scroll",
      "Cache newsfeed for 60s",
      "Optimize image sizes in feed cards",
    ],
  },
  {
    area: "Content",
    icon: "BookOpen",
    score: 85,
    trend: "stable",
    finding: "Community guidelines are clear and accessible.",
    detail:
      "Onboarding copy is strong. Some error messages are too technical for the target audience.",
    fixes: ["Rewrite technical error messages in plain language"],
  },
  {
    area: "Security",
    icon: "Shield",
    score: 59,
    trend: "down",
    finding: "Content moderation layer is incomplete — abuse vectors open.",
    detail:
      "User auth and data storage are secure. Moderation tools must be completed before scaling.",
    fixes: [
      "Build moderation queue before public launch",
      "Add report/flag functionality",
      "Enable rate limiting on post creation",
    ],
  },
  {
    area: "End Products",
    icon: "Award",
    score: 72,
    trend: "up",
    finding: "Engagement report is pending — quality score not yet measured.",
    detail:
      "2 of 4 planned artifacts generated. Activity badge and engagement report are in progress.",
    fixes: [
      "Complete engagement report generation",
      "Add activity badge design",
    ],
  },
];

const DEFAULT_ANALYZE_SCORES: AnalyzeScore[] = ANALYZE_SCORES_PROJ1;

const REVIEW_HISTORY_PROJ1: ReviewEntry[] = [
  {
    date: "Jun 1, 2026",
    score: 88,
    reviewer: "Sarah Chen",
    notes:
      "Scheduling engine v2 is solid. EHR integration needs focus next sprint.",
    decisionPaths: [
      {
        aspect: "Navigation",
        choice: "Feels clear",
        outcome: "No action needed",
        depth: 1,
      },
      {
        aspect: "Performance",
        choice: "Needs improvement",
        outcome: "Sent to builder",
        depth: 2,
      },
    ],
    summary: {
      aspectsReviewed: 5,
      improvementsIdentified: 3,
      sentToBuilder: 1,
    },
  },
  {
    date: "Mar 10, 2026",
    score: 74,
    reviewer: "Sarah Chen",
    notes:
      "Patient portal improvements well-received. Billing edge cases still present.",
    decisionPaths: [
      {
        aspect: "Billing",
        choice: "Edge cases found",
        outcome: "Sent to builder",
        depth: 2,
      },
    ],
    summary: {
      aspectsReviewed: 4,
      improvementsIdentified: 2,
      sentToBuilder: 1,
    },
  },
  {
    date: "Jan 15, 2026",
    score: 62,
    reviewer: "Sarah Chen",
    notes: "Initial release — core flows working but UI needs polish.",
    decisionPaths: [],
    summary: {
      aspectsReviewed: 3,
      improvementsIdentified: 4,
      sentToBuilder: 2,
    },
  },
];

const REVIEW_HISTORY_PROJ2: ReviewEntry[] = [
  {
    date: "Apr 20, 2026",
    score: 78,
    reviewer: "Jordan Kim",
    notes: "Events feature launched. Moderation layer is the next priority.",
    decisionPaths: [
      {
        aspect: "Security",
        choice: "Moderation missing",
        outcome: "Sent to builder",
        depth: 2,
      },
    ],
    summary: {
      aspectsReviewed: 4,
      improvementsIdentified: 3,
      sentToBuilder: 1,
    },
  },
  {
    date: "Jan 22, 2026",
    score: 65,
    reviewer: "Jordan Kim",
    notes:
      "Community threads and profiles are live. Need better notification controls.",
    decisionPaths: [],
    summary: {
      aspectsReviewed: 3,
      improvementsIdentified: 3,
      sentToBuilder: 2,
    },
  },
];

const TEAM_ACTIVITY_PROJ1: TeamActivityEntry[] = [
  {
    action: "Joined project as Clinical Admin",
    member: "Dr. Priya Patel",
    time: "May 20, 2026",
    type: "add",
  },
  {
    action: "Role changed to Lead Developer",
    member: "Marcus Webb",
    time: "Feb 10, 2026",
    type: "role",
  },
  {
    action: "Full access granted",
    member: "Sarah Chen",
    time: "Jan 15, 2026",
    type: "access",
  },
  {
    action: "Joined project as Lead Developer",
    member: "Marcus Webb",
    time: "Jan 15, 2026",
    type: "add",
  },
  {
    action: "Project created",
    member: "Sarah Chen",
    time: "Jan 15, 2026",
    type: "add",
  },
];

const TEAM_ACTIVITY_PROJ2: TeamActivityEntry[] = [
  {
    action: "Joined as Community Manager",
    member: "Alex Torres",
    time: "Apr 5, 2026",
    type: "add",
  },
  {
    action: "Project created",
    member: "Jamie Lee",
    time: "Nov 10, 2025",
    type: "add",
  },
];

const MARKET_REVIEWS = [
  {
    id: "mr1",
    author: "Priya N.",
    rating: 5,
    text: "Incredibly well-structured. Cloned it for our SaaS product.",
    date: "Jun 2026",
  },
  {
    id: "mr2",
    author: "Tom H.",
    rating: 4,
    text: "Solid foundation, good documentation. Minor setup friction.",
    date: "May 2026",
  },
  {
    id: "mr3",
    author: "Sarah K.",
    rating: 5,
    text: "Saved us weeks of work. The workflows are especially well thought out.",
    date: "May 2026",
  },
  {
    id: "mr4",
    author: "Dev Y.",
    rating: 4,
    text: "Great for rapid prototyping. Would love more customization options.",
    date: "Apr 2026",
  },
  {
    id: "mr5",
    author: "Ana L.",
    rating: 5,
    text: "Best template in the market. Clean code, clear spec, easy to follow.",
    date: "Apr 2026",
  },
];

const EXTENDED_DATA: Record<
  string,
  {
    reviewHistory: ReviewEntry[];
    analyzeScores: AnalyzeScore[];
    teamActivity: TeamActivityEntry[];
    marketReviews?: typeof MARKET_REVIEWS;
  }
> = {
  "proj-1": {
    reviewHistory: REVIEW_HISTORY_PROJ1,
    analyzeScores: ANALYZE_SCORES_PROJ1,
    teamActivity: TEAM_ACTIVITY_PROJ1,
    marketReviews: MARKET_REVIEWS,
  },
  "proj-2": {
    reviewHistory: REVIEW_HISTORY_PROJ2,
    analyzeScores: ANALYZE_SCORES_PROJ2,
    teamActivity: TEAM_ACTIVITY_PROJ2,
  },
};

export function getExtendedProjectData(projectId: string) {
  return (
    EXTENDED_DATA[projectId] ?? {
      reviewHistory: REVIEW_HISTORY_PROJ1,
      analyzeScores: DEFAULT_ANALYZE_SCORES,
      teamActivity: TEAM_ACTIVITY_PROJ1,
      marketReviews: undefined,
    }
  );
}

export function getProjectDetailData(
  projectId: string,
): ProjectDetailData | null {
  // Previously fell back to DATA["proj-1"], so any project whose id isn't a
  // seeded proj-1..6 (every user-created project) silently rendered ClearPath
  // Practice's products as its own. Return null for unknown ids; callers show
  // an empty state instead.
  return DATA[projectId] ?? null;
}
