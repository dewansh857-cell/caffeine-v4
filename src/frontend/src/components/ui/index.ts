/**
 * App UI primitive barrel export.
 *
 * Import from this file to get all app-specific primitives:
 *   import { AppCard, AppButton, AppBadge, AppInput, AppAvatar } from "@/components/ui";
 *
 * shadcn/ui primitives (Button, Card, Badge, Input, etc.) are also importable
 * from their individual files:  @/components/ui/button, etc.
 *
 * Rule: use App* prefixed primitives for app-specific content;
 * they enforce the design system and token rules.
 */

// ── shadcn/ui base primitives (compose pages from these) ─────────────
export { Button, buttonVariants } from "./button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
export { Badge, badgeVariants } from "./badge";

// ── App-specific design system primitives (built on shadcn) ──────────
export { AppButton, type AppButtonProps } from "./AppButton";

export {
  AppBadge,
  StatusBadge,
  PriorityBadge,
  type AppBadgeProps,
} from "./AppBadge";

export {
  AppCard,
  AppCardTitle,
  AppCardBody,
  AppCardFooter,
  AppCardDivider,
  AppCardLabel,
  appCardVariants,
  type AppCardProps,
} from "./AppCard";

// ── shadcn re-exports (convenience) ──────────────────────────────
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

export { Input } from "./input";
