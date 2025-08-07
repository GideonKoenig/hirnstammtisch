"use client";

import { EventCard } from "@/components/events/event-item";
import type { ClientEvent } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { Calendar } from "lucide-react";
import { useEvents } from "@/components/events/event-context";

export function DayEventsList(props: {
    date: Date | undefined;
    events: ClientEvent[];
}) {
    const { openModal } = useEvents();
    if (!props.date) {
        return (
            <div className="text-text-muted flex h-48 items-center justify-center md:h-64">
                <div className="px-4 text-center">
                    <Calendar className="mx-auto mb-4 h-10 w-10 opacity-50 md:h-12 md:w-12" />
                    <p className="text-base md:text-lg">
                        Select a date to view events
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-center gap-2 xl:justify-start">
                <Calendar className="text-accent h-4 w-4 md:h-5 md:w-5" />
                <h2 className="text-text text-lg font-semibold md:text-xl">
                    {formatDate(props.date)}
                </h2>
            </div>

            {props.events.length === 0 ? (
                <div className="text-text-muted py-8 text-center md:py-12">
                    <p className="px-4 text-base md:text-lg">
                        No events scheduled for this day
                    </p>
                </div>
            ) : (
                <div className="space-y-3 md:space-y-4">
                    {props.events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            showActions={true}
                            onEdit={openModal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
