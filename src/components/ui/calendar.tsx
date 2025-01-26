"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";
import { de } from "date-fns/locale";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            locale={de}
            weekStartsOn={1}
            showOutsideDays={showOutsideDays}
            className={cn("p-2", className)}
            classNames={{
                months: "relative",
                month: "flex flex-col gap-6 items-center",
                month_caption:
                    "flex flex-row w-full h-8 justify-center text-text-normal items-center relative mx-auto",
                caption_label: "text-base font-medium w-full text-center",
                nav: "flex flex-row absolute w-full items-center justify-between",
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 z-10 bg-transparent p-0 text-text-muted  border-menu-hover focus:bg-transparent focus:text-text-muted hover:bg-transparent hover:text-text-muted",
                ),
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 z-10 bg-transparent p-0 text-text-muted  border-menu-hover focus:bg-transparent focus:text-text-muted hover:bg-transparent hover:text-text-muted",
                ),

                month_grid: "w-full m-0!",
                weekdays: "flex",
                weekday: "text-text-muted rounded-md w-12 font-normal",

                week: "flex w-full mt-6",
                day: cn(
                    "p-1 mx-1 text-center text-sm [&:has([aria-selected])]:bg-menu-light [&:has([aria-selected].day-outside)]:bg-menu-light/50 [&:has([aria-selected].day-range-end)]:rounded-r-full",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md",
                ),

                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-8 w-8 p-4 focus-visible:ring-menu-light hover:bg-menu-light font-normal aria-selected:opacity-100 border border-transparent",
                ),

                range_start: "day-range-start",
                range_end: "day-range-end",
                range_middle: "",

                today: "border-menu-light",
                selected:
                    "bg-menu-light text-text-normal focus:bg-menu-light focus:text-text-normal",
                outside:
                    "day-outside text-neutral-500 opacity-50 aria-selected:text-text-muted aria-selected:opacity-30 ",

                disabled: "text-text-normal opacity-50",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: (props: {
                    orientation?: "up" | "down" | "left" | "right";
                }) => {
                    if (props.orientation === "left") {
                        return <ChevronLeftIcon className="h-4 w-4" />;
                    }
                    return <ChevronRightIcon className="h-4 w-4" />;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
