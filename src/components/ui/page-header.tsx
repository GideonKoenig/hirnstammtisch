"use client";

import { cn } from "@/lib/utils";

export function PageHeader(props: {
    title: string;
    subtitle?: string;
    className?: string;
}) {
    return (
        <div className={cn("w-full", props.className)}>
            <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {props.title}
                </h1>
                {props.subtitle && (
                    <p className="text-text-muted mt-1 text-sm md:text-base">
                        {props.subtitle}
                    </p>
                )}
            </div>

            <div className="relative mt-2 h-1.5">
                <span className="absolute top-0 left-0 h-0.5 w-24 rounded-full bg-[linear-gradient(90deg,var(--color-accent),transparent)]" />
                <span className="absolute top-0.5 left-0 h-0.5 w-22 rounded-full bg-[linear-gradient(90deg,var(--color-accent),transparent)]" />
            </div>
        </div>
    );
}
