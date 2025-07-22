"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { formatDate } from "@/lib/date";

export function DatePicker(props: {
    className?: string;
    placeholder?: string;
    selectedDate?: Date | null;
    highlightedDates?: Date[];
    disabled?: boolean;
    onChange?: (date?: Date) => void | Promise<void>;
}) {
    const [open, setOpen] = useState<boolean>(false);

    const displayValue = props.selectedDate
        ? formatDate(props.selectedDate, true)
        : (props.placeholder ?? "Select date");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={props.disabled}>
                <Button
                    variant="outline"
                    className={cn(
                        "border-border bg-bg hover:bg-bg-muted w-full justify-between text-sm font-normal",
                        props.className,
                    )}
                >
                    <span
                        className={
                            props.selectedDate ? "text-text" : "text-text-muted"
                        }
                    >
                        {displayValue}
                    </span>
                    <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="border-border bg-bg z-[100] w-auto p-0 shadow-lg"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={props.selectedDate ?? undefined}
                    onSelect={async (date?: Date) => {
                        if (props.onChange) await props.onChange(date);
                        setOpen(false);
                    }}
                    modifiers={{
                        highlighted: props.highlightedDates ?? [],
                    }}
                    modifiersClassNames={{
                        highlighted:
                            "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-accent after:rounded-full",
                    }}
                    enableDropdownNavigation={false}
                    className="border-border bg-bg"
                />
            </PopoverContent>
        </Popover>
    );
}
