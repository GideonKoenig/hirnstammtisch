"use client";

import { useState } from "react";
import { type Event, type User } from "~/lib/data-types";
import EventCard from "~/components/event-card";
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
            event.eventAt?.toDateString() === selectedDate?.toDateString(),
    );
    const speaker = props.users.find(
        (user) => user.id === selectedEvent?.speaker,
    );

    return (
        <div className="flex h-full w-full flex-col items-center gap-4 p-2 pb-4 lg:pt-6">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className={cn(
                    "rounded-md border border-menu-light shadow-md shadow-menu-dark",
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
            {/* <div className="w-full flex-grow p-4">
                <div className="h-full w-full rounded-md border border-menu-light shadow-md shadow-menu-dark">
                    {selectedEvent && (
                        <EventCard event={selectedEvent} speaker={speaker} />
                    )}
                </div>
            </div> */}
            {selectedEvent && (
                <div className="flex w-full max-w-xl flex-col gap-4 px-4">
                    <EventCard
                        className="w-full shadow-md"
                        event={selectedEvent}
                        speaker={speaker}
                    />
                    <EventForm
                        className="w-full shadow-md"
                        event={selectedEvent}
                        users={props.users}
                    />
                </div>
            )}
        </div>
    );
}

{
    /* <div className="h-full flex-grow rounded-md border border-menu-light shadow shadow-menu-dark">
                {selectedEvent && (
                    <p className="grid grid-cols-[100px_auto] gap-1 px-2 py-4 text-sm">
                        <span className="text-text-muted">Speaker:</span>
                        <span>{selectedEvent.speaker}</span>
                        <span className="text-text-muted">Suggested By:</span>
                        <span>{selectedEvent.suggestedBy}</span>
                        <span className="text-text-muted">Topic:</span>
                        <span>{selectedEvent.description}</span>
                        <span className="text-text-muted">Presentation:</span>
                        {selectedEvent.presentationUrl ? (
                            <div className="flex flex-row items-center justify-between">
                                <a
                                    href={selectedEvent.presentationUrl}
                                    className="underline"
                                >
                                    <p>
                                        {selectedEvent.presentationUrl.slice(
                                            0,
                                            25,
                                        ) + "..."}
                                    </p>
                                </a>
                                <button
                                    onMouseDown={async () => {
                                        await updateTopicPresentationUrl({
                                            id: selectedEvent.id,
                                            presentationUrl: null,
                                        });
                                    }}
                                >
                                    <X className="h-5 w-5 p-1" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <input
                                    className="w-full bg-menu-main placeholder:text-text-muted focus-visible:outline-none"
                                    placeholder="Not provided yet..."
                                    onKeyDown={async (event) => {
                                        if (event.key === "Enter") {
                                            const value =
                                                event.currentTarget.value;
                                            await updateTopicPresentationUrl({
                                                id: selectedEvent.id,
                                                presentationUrl: value,
                                            });
                                        }
                                    }}
                                />
                            </>
                        )}
                    </p>
                )}
            </div> */
}
