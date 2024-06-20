import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "khld-inline-flex khld-items-center khld-justify-center khld-rounded-md khld-text-sm khld-font-medium khld-ring-offset-background khld-transition-colors hover:khld-bg-muted hover:khld-text-muted-foreground focus-visible:khld-outline-none focus-visible:khld-ring-2 focus-visible:khld-ring-ring focus-visible:khld-ring-offset-2 disabled:khld-pointer-events-none disabled:khld-opacity-50 data-[state=on]:khld-bg-accent data-[state=on]:khld-text-accent-foreground",
  {
    variants: {
      variant: {
        default: "khld-bg-transparent",
        outline:
          "khld-border khld-border-input khld-bg-transparent hover:khld-bg-accent hover:khld-text-accent-foreground",
      },
      size: {
        default: "khld-h-10 khld-px-3",
        sm: "khld-h-9 khld-px-2.5",
        lg: "khld-h-11 khld-px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
