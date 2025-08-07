"use client";

import { MemberCard } from "@/components/about/member-card";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export function MemberList() {
    const { data: users = [], error: usersError } = api.user.getAll.useQuery();
    const { data: events = [], error: eventsError } =
        api.event.getAll.useQuery();

    if (usersError) toast.error(usersError.message);
    if (eventsError) toast.error(eventsError.message);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastEvents = events.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
    });

    const usersWithPastEvents = users.filter((user) =>
        pastEvents.some((event) => event.speaker === user.id),
    );

    return (
        <>
            <h2 className="mb-6 w-full text-2xl font-bold">Members</h2>
            <div className="flex w-full flex-col gap-6">
                {usersWithPastEvents
                    .sort(
                        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
                    )
                    .map((user) => (
                        <MemberCard
                            key={user.id}
                            user={user}
                            events={pastEvents.filter(
                                (event) => event.speaker === user.id,
                            )}
                        />
                    ))}
            </div>
        </>
    );
}
