"use client";

import { useState } from "react";
import { type Event, type User } from "~/lib/data-types";
import { EventForm } from "~/components/event-form";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";

export default function EventCalendar(props: {
    events: Event[];
    users: User[];
    className?: string;
}) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const selectedEvent = props.events.find(
        (event) =>
            event.eventAt?.toDateString() === selectedDate?.toDateString() &&
            selectedDate !== undefined,
    );

    return (
        <div className="flex h-full w-full flex-col items-center gap-4 p-2 pb-4 lg:pt-6">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className={cn(
                    "border-menu-light shadow-menu-dark rounded-md border shadow-md",
                    props.className,
                )}
                modifiers={{
                    hasEvent: props.events
                        .map((event) => event.eventAt)
                        .filter(
                            (event) => event !== undefined && event !== null,
                        ),
                }}
                modifiersClassNames={{
                    hasEvent: "underline aria-selected:text-accent text-accent",
                }}
            />

            {selectedEvent && (
                <div className="flex w-full max-w-xl flex-col gap-4 px-4">
                    <EventForm
                        className="w-full shadow-md"
                        event={selectedEvent}
                        events={props.events}
                        users={props.users}
                    />
                </div>
            )}
        </div>
    );
}
