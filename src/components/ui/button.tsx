import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "khld-inline-flex khld-items-center khld-justify-center khld-whitespace-nowrap khld-rounded-md khld-text-sm khld-font-medium khld-ring-offset-background khld-transition-colors focus-visible:khld-outline-none focus-visible:khld-ring-2 focus-visible:khld-ring-ring focus-visible:khld-ring-offset-2 disabled:khld-pointer-events-none disabled:khld-opacity-50",
  {
    variants: {
      variant: {
        default: "khld-bg-primary khld-text-primary-foreground hover:khld-bg-primary/90",
        destructive:
          "khld-bg-destructive khld-text-destructive-foreground hover:khld-bg-destructive/90",
        outline:
          "khld-border khld-border-input khld-bg-background hover:khld-bg-accent hover:khld-text-accent-foreground",
        secondary:
          "khld-bg-secondary khld-text-secondary-foreground hover:khld-bg-secondary/80",
        ghost: "hover:khld-bg-accent hover:khld-text-accent-foreground",
        link: "khld-text-primary khld-underline-offset-4 hover:khld-underline",
      },
      size: {
        default: "khld-h-10 khld-px-4 khld-py-2",
        sm: "khld-h-9 khld-rounded-md khld-px-3",
        lg: "khld-h-11 khld-rounded-md khld-px-8",
        icon: "khld-h-10 khld-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
