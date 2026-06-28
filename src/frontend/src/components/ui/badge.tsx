import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Badge — canonical pill primitive.
 * `default` uses the consistent --accent token (NOT --primary, which is
 * defined inconsistently across theme blocks). `bare` carries no colour, so
 * semantic wrappers (AppBadge) can supply their own status/priority tokens.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-none transition-colors [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        secondary: "bg-muted text-muted-foreground",
        outline: "border border-border text-foreground",
        destructive:
          "[background:var(--color-status-error-bg)] [color:var(--color-status-error)]",
        bare: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
