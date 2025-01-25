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
            className={cn("p-3", className)}
            classNames={{
                months: "flex",
                month: "space-y-6 space-x-6 flex flex-col gap-8 items-center",
                caption:
                    "flex flex-row w-full justify-center text-text-normal items-center relative mx-auto",
                caption_label: "text-base font-medium w-full text-center",
                nav: "flex flex-row absolute w-full h-full top-0 left-0 items-center justify-between",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-transparent p-0 text-text-muted  border-menu-hover focus:bg-transparent focus:text-text-muted hover:bg-transparent hover:text-text-muted",
                ),
                nav_button_previous: "",
                nav_button_next: "",

                table: "w-full m-0!",
                head_row: "flex",
                head_cell: "text-text-muted rounded-md w-12 font-normal",

                row: "flex w-full mt-6",
                cell: cn(
                    "p-1 mx-1 text-center text-sm [&:has([aria-selected])]:bg-menu-light [&:has([aria-selected].day-outside)]:bg-menu-light/50 [&:has([aria-selected].day-range-end)]:rounded-r-full",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md",
                ),

                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-8 w-8 p-4 focus-visible:ring-menu-light hover:bg-menu-light font-normal aria-selected:opacity-100 border border-transparent",
                ),

                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_range_middle: "",

                day_today: "border-menu-light",
                day_selected:
                    "bg-menu-light text-text-normal focus:bg-menu-light focus:text-text-normal",
                day_outside:
                    "day-outside text-neutral-500 opacity-50 aria-selected:text-text-muted aria-selected:opacity-30 ",

                day_disabled: "text-text-normal opacity-50",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
                IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
