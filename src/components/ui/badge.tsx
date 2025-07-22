import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border border-border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-text focus-visible:ring-text/50 focus-visible:ring-[3px] aria-invalid:ring-accent/20 aria-invalid:border-accent transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-bg-muted text-text [a&]:hover:bg-bg-muted/90",
                secondary:
                    "border-transparent bg-bg text-text-muted [a&]:hover:bg-bg/90",
                destructive:
                    "border-transparent bg-accent text-text-contrast [a&]:hover:bg-accent/90 focus-visible:ring-accent/20",
                outline:
                    "text-text [a&]:hover:bg-bg-muted [a&]:hover:text-text",
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
    asChild = false,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
