"use client";

import { useState } from "react";
import { type Topic } from "~/components/topics/types";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/components/utils";

export default function EventCalendar(props: { events: Topic[]; className?: string }) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Topic | undefined>();

    return (
        <>
            <div className="flex flex-row items-end gap-2">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date: Date | undefined) => {
                        setSelectedDate(date);
                        if (date) {
                            const event = props.events.find(
                                (event) => event.eventAt?.toDateString() === date.toDateString(),
                            );
                            setSelectedEvent(event);
                        } else {
                            setSelectedEvent(undefined);
                        }
                    }}
                    className={cn("rounded-md border", props.className)}
                    modifiers={{
                        hasEvent: props.events
                            .map((event) => event.eventAt)
                            .filter((event) => event !== undefined),
                    }}
                    modifiersClassNames={{
                        hasEvent: "underline aria-selected:text-accent-light text-accent-light",
                    }}
                />
                <div className="h-full flex-grow rounded-md border border-menu-light shadow shadow-menu-dark">
                    {selectedEvent && (
                        <p className="grid grid-cols-[100px_auto] gap-1 px-2 py-4 text-sm">
                            <span className="text-text-muted">Speaker:</span>
                            <span>{selectedEvent.speaker}</span>
                            <span className="text-text-muted">Suggested By:</span>
                            <span>{selectedEvent.suggestedBy}</span>
                            <span className="text-text-muted">Topic:</span>
                            <span>{selectedEvent.description}</span>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
