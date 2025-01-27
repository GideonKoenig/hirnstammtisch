"use client";

import { useState } from "react";
import { EventForm } from "~/components/event-form";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { useData } from "~/components/data-provider";

export default function EventCalendar(props: { className?: string }) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const { events, users } = useData({
        prepareEvents: (events) => events.filter((event) => !event.deleted),
    });
    const selectedEvent = events.find(
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
                    hasEvent: events
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
                        events={events}
                        users={users}
                    />
                </div>
            )}
        </div>
    );
}
