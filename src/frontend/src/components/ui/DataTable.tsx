import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortDir?: SortDirection;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  emptyState?: ReactNode;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowHeight?: "sm" | "md" | "lg";
  showHeader?: boolean;
  toolbar?: ReactNode;
  footer?: ReactNode;
}

const ROW_HEIGHTS = {
  sm: "h-10",
  md: "h-12",
  lg: "h-14",
};

const ALIGN_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchable = false,
  searchKeys,
  searchPlaceholder = "Search...",
  sortable = true,
  defaultSortKey,
  defaultSortDir = null,
  onRowClick,
  rowClassName,
  emptyState,
  className,
  tableClassName,
  headerClassName,
  rowHeight = "md",
  showHeader = true,
  toolbar,
  footer,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSortDir);

  const filtered = useMemo(() => {
    if (!searchable || !search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys ?? columns.map((c) => c.key);
      return keys.some((k) => {
        const val = (row as Record<string, unknown>)[k];
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [data, search, searchable, searchKeys, columns]);

  const sorted = useMemo(() => {
    if (!sortable || !sortKey || !sortDir) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sortable) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return sortDir === "asc" ? -1 : 1;
      if (bv == null) return sortDir === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }, [filtered, sortable, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (!sortable) return;
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ colKey }: { colKey: string }) {
    if (sortKey !== colKey)
      return <ArrowUpDown size={14} className="opacity-40" />;
    if (sortDir === "asc") return <ArrowUp size={14} />;
    if (sortDir === "desc") return <ArrowDown size={14} />;
    return <ArrowUpDown size={14} className="opacity-40" />;
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {(searchable || toolbar) && (
        <div className="flex items-center gap-3">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-background border-input text-sm"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className={cn("w-full text-sm", tableClassName)}>
          {showHeader && (
            <thead>
              <tr
                className={cn(
                  "border-b border-border bg-muted/40",
                  headerClassName,
                )}
              >
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                      col.sortable &&
                        sortable &&
                        "cursor-pointer select-none hover:text-foreground",
                      ALIGN_MAP[col.align ?? "left"],
                    )}
                    style={{ width: col.width }}
                    onClick={() => toggleSort(col.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") toggleSort(col.key);
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && sortable && (
                        <SortIcon colKey={col.key} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--color-text-muted)]"
                >
                  {emptyState ?? "No results found."}
                </td>
              </tr>
            ) : (
              sorted.map((row, idx) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onRowClick?.(row);
                  }}
                  className={cn(
                    "border-b border-border last:border-b-0 transition-colors",
                    ROW_HEIGHTS[rowHeight],
                    onRowClick && "cursor-pointer hover:bg-muted/30",
                    idx % 2 === 1 && "bg-muted/20",
                    rowClassName?.(row),
                  )}
                  data-ocid={`table.row.${idx + 1}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-2 text-foreground",
                        ALIGN_MAP[col.align ?? "left"],
                      )}
                      style={{ width: col.width }}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {footer}
    </div>
  );
}
