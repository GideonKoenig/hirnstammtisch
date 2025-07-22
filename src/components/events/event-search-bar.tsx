"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Calendar } from "lucide-react";
import { useEvents } from "@/components/events/event-context";
import { cn } from "@/lib/utils";

export function EventsSearchBar(props: { className?: string }) {
    const { search, setSearch, pastEvents, setPastEvents, openModal } =
        useEvents();

    return (
        <div
            className={cn(
                "flex w-full flex-row items-center gap-2",
                props.className,
            )}
        >
            <Input
                value={search}
                placeholder="Search events"
                onChange={(event) => {
                    setSearch(event.target.value);
                }}
                className="grow"
            />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Toggle
                        pressed={pastEvents}
                        onPressedChange={setPastEvents}
                        variant="outline"
                        className={cn(
                            pastEvents && "bg-accent hover:bg-accent/90",
                        )}
                    >
                        <Calendar className="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                    {pastEvents ? "Hide past events" : "Show past events"}
                </TooltipContent>
            </Tooltip>
            <Button
                onClick={() => openModal()}
                variant="accent"
                size="icon"
                className="aspect-square"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
