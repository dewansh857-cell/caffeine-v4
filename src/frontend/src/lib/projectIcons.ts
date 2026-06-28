import type { Project } from "@/types";
import { ICON_COLORS } from "@/types";
import {
  Activity,
  BarChart2,
  BookOpen,
  Box,
  Briefcase,
  CalendarCheck,
  Camera,
  CheckSquare,
  Code,
  Cpu,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Lock,
  Map as MapIcon,
  MessageSquare,
  Music,
  Package,
  Pencil,
  Plane,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Stethoscope,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

export const ICON_MAP: Record<string, IconComponent> = {
  Activity,
  BarChart2,
  BookOpen,
  Box,
  Briefcase,
  CalendarCheck,
  Camera,
  CheckSquare,
  Code,
  Cpu,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Lock,
  Map: MapIcon,
  MessageSquare,
  Music,
  Package,
  Pencil,
  Plane,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Stethoscope,
  TrendingUp,
  Users,
  Wrench,
  Zap,
};

export function getProjectIcon(iconName: string): IconComponent {
  return ICON_MAP[iconName] ?? Box;
}

/** Deterministic fallback color from ICON_COLORS palette based on project id */
export function getProjectIconColor(project: Project): string {
  if (project.iconColor) {
    return project.iconColor;
  }
  // Deterministic fallback based on project id
  const hash = project.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = ICON_COLORS[hash % ICON_COLORS.length];
  return color.value;
}

/** Returns token-based Tailwind classes for the icon container */
export function getIconColorClass(project: Project): string {
  const maturity = project.metadata?.maturity;
  const status = project.deploymentStatus;

  if (status === "live" || maturity === "live") {
    return "bg-[--color-status-deployed-bg] text-[--color-status-deployed]";
  }
  if (maturity === "building") {
    return "bg-[--color-status-ready-bg] text-[--color-status-ready]";
  }
  if (maturity === "defining") {
    return "bg-accent/10 text-accent";
  }
  if (maturity === "exploring") {
    return "bg-muted/60 text-muted-foreground";
  }
  // idea / default
  return "bg-muted text-muted-foreground";
}
