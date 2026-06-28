import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { buttonVariants } from "./button";

/**
 * AppButton — semantic wrapper over the shadcn `buttonVariants`.
 * Keeps the app's variant/size vocabulary while delegating styling to the
 * shadcn button system (single source of truth).
 *   primary  → accent CTA (uses the consistent --accent token, not --primary)
 *   secondary→ shadcn "secondary"
 *   ghost    → shadcn "ghost"
 *   danger   → shadcn "destructive"
 * Disabled state uses shadcn's standard subtle treatment — no extra graying.
 */
export type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type AppButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  disabled?: boolean;
}

const VARIANT_MAP: Record<
  AppButtonVariant,
  { base: "default" | "secondary" | "ghost" | "destructive"; extra: string }
> = {
  // accent override (bg-accent) wins over shadcn default's bg-primary via tailwind-merge
  primary: {
    base: "default",
    extra: "bg-accent text-accent-foreground hover:bg-accent/90",
  },
  secondary: { base: "secondary", extra: "" },
  ghost: { base: "ghost", extra: "" },
  danger: { base: "destructive", extra: "" },
};

const SIZE_MAP: Record<AppButtonSize, "sm" | "default" | "lg"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

const spinnerSize: Record<AppButtonSize, number> = { sm: 13, md: 14, lg: 16 };

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      children,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const v = VARIANT_MAP[variant];
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({ variant: v.base, size: SIZE_MAP[size] }),
          v.extra,
          className,
        )}
        {...rest}
      >
        {loading && (
          <Loader2
            className="animate-spin"
            size={spinnerSize[size]}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);
AppButton.displayName = "AppButton";

/** Alias so existing imports continue to work */
export const Button = AppButton;
