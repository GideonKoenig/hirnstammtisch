"use client";

import { EventCard } from "~/components/event-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getWeekDistance } from "~/lib/date";
import { useData } from "~/components/data-provider";

export default function HomePage() {
    const { events, users } = useData({
        prepareEvents: (events) =>
            events
                .filter((event) => event.eventAt !== null)
                .filter((event) => event.eventAt !== undefined),
    });

    const curentEvents = events
        .filter((event) => {
            const weekDistance = getWeekDistance(event.eventAt!);
            return weekDistance >= 0;
        })
        .sort((a, b) => a.eventAt!.getTime() - b.eventAt!.getTime());
    const pastEvents = events
        .filter((event) => {
            const weekDistance = getWeekDistance(event.eventAt!);
            return weekDistance < 0;
        })
        .sort((a, b) => b.eventAt!.getTime() - a.eventAt!.getTime());

    return (
        <ScrollArea className="h-full w-full">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4 p-4">
                <p className="text-2xl font-bold">Current Events</p>
                {curentEvents.map((event) => {
                    const user = users.find(
                        (user) => user.id === event.speaker,
                    );
                    return (
                        <EventCard
                            key={event.id}
                            event={event}
                            speaker={user}
                        />
                    );
                })}

                <p className="pt-4 text-2xl font-bold">
                    Past Events
                    <span className="text-text-muted text-xl whitespace-pre">
                        {"  "}({pastEvents.length})
                    </span>
                </p>
                {pastEvents.map((event) => {
                    const user = users.find(
                        (user) => user.id === event.speaker,
                    );
                    return (
                        <EventCard
                            key={event.id}
                            event={event}
                            speaker={user}
                        />
                    );
                })}
            </div>
        </ScrollArea>
    );
}
