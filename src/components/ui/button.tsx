import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "cursor-pointer select-none transition-colors active:scale-[0.98] motion-reduce:active:scale-100",
    // Same visible focus style as the rest of the app (a 1px ring is easy to miss on dark UI).
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-input bg-transparent hover:border-link-cyan/60 hover:bg-accent hover:text-accent-foreground",
        // Cyan outline, as used for join / scan actions.
        accent:
          "border border-link-cyan text-link-cyan hover:bg-link-cyan/10 active:bg-link-cyan/20",
        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Compact on mouse devices, 44px+ on touch screens (the coarse-pointer media query).
      size: {
        default: "h-9 px-4 py-2 [@media(pointer:coarse)]:h-11",
        sm: "h-8 px-3 text-xs [@media(pointer:coarse)]:h-10",
        lg: "h-10 px-8 [@media(pointer:coarse)]:h-12",
        icon: "h-9 w-9 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Shows a spinner and blocks clicks. Ignored with asChild. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const showSpinner = loading && !asChild;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        // Plain buttons default to type="button" so they never submit a form by accident.
        {...(!asChild && { type: props.type ?? "button" })}
        disabled={disabled || showSpinner}
        aria-busy={showSpinner || undefined}
        {...props}
      >
        {/* Slot needs exactly one child, so only add the spinner for plain buttons. */}
        {asChild ? (
          children
        ) : (
          <>
            {showSpinner && (
              <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden />
            )}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
