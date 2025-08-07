"use client";

import { EventCard } from "@/components/events/event-item";
import { useEvents } from "@/components/events/event-context";
import { type ClientEvent, type ClientUser } from "@/lib/types";
import { getSpeaker } from "@/lib/utils";
import { api } from "@/trpc/react";

function filterEvents(
    events: ClientEvent[],
    search: string,
    users: ClientUser[],
    pastEvents: boolean,
) {
    const filtered = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const event of events) {
        const title = event.title.toLowerCase();
        if (!title.includes(search.toLowerCase())) continue;

        if (event.date) {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            if (!pastEvents && eventDate < today) continue;
        }

        filtered.push(event);
    }

    return filtered;
}

export function EventList(props: { showSpeakerNames?: boolean }) {
    const { search, pastEvents, openModal } = useEvents();

    const { data: users = [] } = api.user.getAll.useQuery();
    const { data: events = [] } = api.event.getAll.useQuery();

    const eventsFiltered = filterEvents(events, search, users, pastEvents)
        .filter((event) => getSpeaker(event, users) !== undefined)
        .sort((a, b) => {
            const speakerA = getSpeaker(a, users)!;
            const speakerB = getSpeaker(b, users)!;

            const nameComparison = speakerA.name.localeCompare(speakerB.name);
            if (nameComparison !== 0) return nameComparison;

            return b.createdAt.getTime() - a.createdAt.getTime();
        });

    return (
        <div className="flex flex-col gap-2">
            {eventsFiltered.map((event, index) => {
                const speaker = getSpeaker(event, users)!;
                const prevSpeakerId =
                    index > 0
                        ? getSpeaker(eventsFiltered[index - 1]!, users)?.id
                        : undefined;
                const showSpeaker = speaker.id !== prevSpeakerId;

                return (
                    <div key={event.id} className="flex flex-col gap-4">
                        {showSpeaker && props.showSpeakerNames && (
                            <h2
                                id={`user-${speaker.id}`}
                                className="mt-2 text-lg font-semibold"
                            >
                                {speaker.name}
                            </h2>
                        )}
                        <EventCard
                            event={event}
                            showActions={true}
                            onEdit={openModal}
                        />
                    </div>
                );
            })}
        </div>
    );
}
