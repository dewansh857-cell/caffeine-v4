import { cn } from "@/lib/utils";
import { Badge as ShadcnBadge } from "./badge";

/**
 * AppBadge — single canonical badge component.
 * All colors reference --color-* semantic CSS custom properties — no raw palette classes.
 *
 * variant="status"   value: live | building | exploring | defining | idea
 * variant="priority" value: high | medium | low
 * variant="category" value: any string (muted style)
 */

// Status badge color maps keyed by value
const STATUS_STYLES: Record<string, string> = {
  live: "[background:var(--color-status-success-bg)] [color:var(--color-status-success)]",
  building:
    "[background:var(--color-status-building-bg)] [color:var(--color-status-building)]",
  exploring:
    "[background:var(--color-status-ready-bg)] [color:var(--color-status-ready)]",
  defining:
    "[background:color-mix(in_oklch,var(--color-accent)_12%,transparent)] [color:var(--color-accent)]",
  idea: "bg-muted text-muted-foreground",
  deployed:
    "[background:var(--color-status-deployed-bg)] [color:var(--color-status-deployed)]",
  error:
    "[background:var(--color-status-error-bg)] [color:var(--color-status-error)]",
  warning:
    "[background:var(--color-status-warning-bg)] [color:var(--color-status-warning)]",
  success:
    "[background:var(--color-status-success-bg)] [color:var(--color-status-success)]",
  ready:
    "[background:var(--color-status-ready-bg)] [color:var(--color-status-ready)]",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "[background:var(--color-priority-high-bg)] [color:var(--color-priority-high)]",
  medium:
    "[background:var(--color-priority-medium-bg)] [color:var(--color-priority-medium)]",
  low: "[background:var(--color-priority-low-bg)] [color:var(--color-priority-low)]",
};

function resolveClasses(
  variant: AppBadgeProps["variant"],
  value: string | undefined,
): string {
  const v = (value ?? "").toLowerCase();
  if (variant === "status")
    return STATUS_STYLES[v] ?? "bg-muted text-muted-foreground";
  if (variant === "priority")
    return PRIORITY_STYLES[v] ?? "bg-muted text-muted-foreground";
  // category or any other variant
  return "bg-muted text-muted-foreground";
}

export interface AppBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Controls which color map is used */
  variant: "status" | "priority" | "category";
  /** The string value used to look up the correct colors */
  value?: string;
  className?: string;
}

export function AppBadge({
  variant,
  value,
  className,
  children,
  ...props
}: AppBadgeProps) {
  const colorClasses = resolveClasses(
    variant,
    value ?? (typeof children === "string" ? children : undefined),
  );
  return (
    <ShadcnBadge
      variant="bare"
      className={cn(colorClasses, className)}
      {...props}
    >
      {children ?? value}
    </ShadcnBadge>
  );
}

/** Convenience alias for backward compatibility */
export const Badge = AppBadge;
export type BadgeProps = AppBadgeProps;

/**
 * Pre-bound status badge: <StatusBadge value="live" />
 */
export function StatusBadge({
  value,
  className,
  ...props
}: Omit<AppBadgeProps, "variant">) {
  return (
    <AppBadge variant="status" value={value} className={className} {...props} />
  );
}

/**
 * Pre-bound priority badge: <PriorityBadge value="high" />
 */
export function PriorityBadge({
  value,
  className,
  ...props
}: Omit<AppBadgeProps, "variant">) {
  return (
    <AppBadge
      variant="priority"
      value={value}
      className={className}
      {...props}
    />
  );
}

/** Exported variants map for consumers that need to inspect available values */
export const appBadgeVariants = {
  status: Object.keys(STATUS_STYLES),
  priority: Object.keys(PRIORITY_STYLES),
} as const;
