"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { useState } from "react";

export function DatePicker(props: {
    className?: string;
    label?: string;
    initialValue: Date | undefined | null;
    onChange?: (date?: Date) => void | Promise<void>;
}) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "justify-between bg-menu-light p-2 px-4 text-left font-normal shadow shadow-menu-dark hover:bg-menu-hover hover:text-text-normal",
                        props.className,
                    )}
                >
                    {props.label ?? "-"}
                    <CalendarIcon className="h-4 w-4 stroke-1 text-text-normal" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={props.initialValue ?? undefined}
                    onSelect={async (date?: Date) => {
                        if (props.onChange) await props.onChange(date);
                        setOpen(false);
                    }}
                    initialFocus
                    modifiers={{
                        hasEvent: props.initialValue ?? [],
                    }}
                    modifiersClassNames={{
                        hasEvent:
                            "underline aria-selected:text-accent-light text-accent-light",
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
