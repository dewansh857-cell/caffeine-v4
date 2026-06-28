import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";

interface ListRowProps {
  icon?: LucideIcon;
  /** Color classes for the icon tile, e.g. "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]" */
  iconClassName?: string;
  /** Custom leading element (e.g. an AppIcon) — used instead of `icon`. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned cluster: status pill, meta, action link, etc. */
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Shared list row — the single coherent row pattern used across Home, Projects,
 * Live, and other list screens. Icon tile + title/subtitle + trailing cluster.
 * Wrap a set of these in <ListContainer> for the card + dividers.
 */
export function ListRow({
  icon: Icon,
  iconClassName,
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  className,
  "data-ocid": ocid,
}: ListRowProps) {
  const interactive = !!onClick;
  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (interactive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.();
    }
  }
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? handleKey : undefined}
      data-ocid={ocid}
      className={cn(
        "flex items-center gap-3.5 px-4 py-3.5 transition-colors",
        interactive &&
          "cursor-pointer hover:bg-[var(--color-accent)]/[0.04] focus-visible:outline-none focus-visible:bg-[var(--color-accent)]/[0.04]",
        className,
      )}
    >
      {leading
        ? leading
        : Icon && (
            <span
              className={cn(
                "w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0",
                iconClassName ??
                  "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
            </span>
          )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--color-text)] truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      {trailing && (
        <div className="flex items-center gap-3 flex-shrink-0">{trailing}</div>
      )}
    </div>
  );
}

/** Card wrapper that holds a set of ListRows with dividers between them. */
export function ListContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-card overflow-hidden divide-y divide-[var(--color-border)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
