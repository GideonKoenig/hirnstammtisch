"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateTopicPresentationUrl } from "~/components/topics/db";
import { type Topic } from "~/components/topics/types";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/components/utils";

export default function EventCalendar(props: {
    events: Topic[];
    className?: string;
}) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const [selectedEvent, setSelectedEvent] = useState<Topic | undefined>(() =>
        props.events.find(
            (event) =>
                event.eventAt?.toDateString() === new Date().toDateString(),
        ),
    );
    const router = useRouter();

    return (
        <>
            <div className="flex max-w-[600px] flex-row items-end gap-2">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date: Date | undefined) => {
                        setSelectedDate(date);
                        if (date) {
                            const event = props.events.find(
                                (event) =>
                                    event.eventAt?.toDateString() ===
                                    date.toDateString(),
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
                        hasEvent:
                            "underline aria-selected:text-accent-light text-accent-light",
                    }}
                />
                <div className="h-full flex-grow rounded-md border border-menu-light shadow shadow-menu-dark">
                    {selectedEvent && (
                        <p className="grid grid-cols-[100px_auto] gap-1 px-2 py-4 text-sm">
                            <span className="text-text-muted">Speaker:</span>
                            <span>{selectedEvent.speaker}</span>
                            <span className="text-text-muted">
                                Suggested By:
                            </span>
                            <span>{selectedEvent.suggestedBy}</span>
                            <span className="text-text-muted">Topic:</span>
                            <span>{selectedEvent.description}</span>
                            <span className="text-text-muted">
                                Presentation:
                            </span>
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
                                            setSelectedEvent(() => ({
                                                ...selectedEvent,
                                                presentationUrl: undefined,
                                            }));
                                            router.refresh();
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
                                                await updateTopicPresentationUrl(
                                                    {
                                                        id: selectedEvent.id,
                                                        presentationUrl: value,
                                                    },
                                                );
                                                setSelectedEvent(() => ({
                                                    ...selectedEvent,
                                                    presentationUrl: value,
                                                }));
                                                router.refresh();
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
