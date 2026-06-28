// Shared formatting helpers. Single source of truth — replaces the per-page
// copies of timeAgo / formatDate that had drifted apart.

/** Relative "time ago" label from a timestamp (ms, as number or bigint). */
export function timeAgo(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  const days = Math.floor((Date.now() - ms) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/** Absolute date label, e.g. "Jun 21, 2026". Returns "—" for missing values. */
export function formatDate(ts: bigint | number | undefined): string {
  if (!ts) return "—";
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
