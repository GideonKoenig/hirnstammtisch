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
import { usePwa } from "~/components/pwa-provider";
import { type Event } from "~/lib/data-types";

export function DatePicker(props: {
    className?: string;
    label?: string;
    events?: Event[];
    initialValue: Date | undefined | null;
    onChange?: (date?: Date) => void | Promise<void>;
}) {
    const { isOffline } = usePwa();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={isOffline}>
                <Button
                    variant={"outline"}
                    className={cn(
                        "bg-menu-light shadow-menu-dark hover:bg-menu-hover hover:text-text-normal justify-between p-2 px-4 text-left font-normal shadow-sm disabled:pointer-events-auto disabled:cursor-not-allowed",
                        props.className,
                    )}
                >
                    {props.label ?? "-"}
                    <CalendarIcon className="text-text-normal h-4 w-4 stroke-1" />
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
                    modifiers={{
                        initialValue: props.initialValue ?? [],
                        hasEvent: props.events
                            ?.map((event) => event.eventAt)
                            .filter(
                                (event) =>
                                    event !== undefined && event !== null,
                            ),
                    }}
                    modifiersClassNames={{
                        initialValue:
                            "underline aria-selected:text-accent-light text-accent-light",
                        hasEvent:
                            "underline aria-selected:text-accent text-accent",
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
