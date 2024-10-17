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
            <div className="flex flex-row">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date: Date | undefined) => {
                        setSelectedDate(date);
                        if (date) {
                            const event = props.events.find(
                                (event) => event.usedAt?.toDateString() === date.toDateString(),
                            );
                            setSelectedEvent(event);
                        } else {
                            setSelectedEvent(undefined);
                        }
                    }}
                    className={cn("rounded-md border", props.className)}
                    modifiers={{
                        hasEvent: props.events
                            .map((event) => event.usedAt)
                            .filter((event) => event !== undefined),
                    }}
                    modifiersClassNames={{
                        hasEvent: "underline",
                    }}
                />
                <div className="flex-grow" />
            </div>

            {selectedEvent && (
                <p className="grid grid-cols-[100px_auto] gap-1 px-2 text-sm">
                    <span className="text-text-muted">Speaker:</span>
                    <span>{selectedEvent.for}</span>
                    <span className="text-text-muted">Topic:</span>
                    <span>{selectedEvent.description}</span>
                    <span className="text-text-muted">Suggested By:</span>
                    <span>{selectedEvent.from}</span>
                </p>
            )}
        </>
    );
}
