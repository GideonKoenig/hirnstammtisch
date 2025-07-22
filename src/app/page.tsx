import { EventCard } from "@/components/events/event-item";
import { api } from "@/trpc/server";
import { type ClientEvent } from "@/lib/types";

export default async function HomePage() {
    const events = await api.event.getAll();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentEvents = events
        .filter((event) => event.date !== null)
        .filter((event) => event.date!.getTime() >= today.getTime())
        .sort((a, b) => a.date!.getTime() - b.date!.getTime());

    const pastEvents = events
        .filter((event) => event.date !== null)
        .filter((event) => event.date!.getTime() < today.getTime())
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());

    return (
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4 p-4">
            <p className="text-2xl font-bold">Current Events</p>
            <div className="flex flex-col gap-2">
                {currentEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
            <p className="pt-4 text-2xl font-bold">
                Past Events
                <span className="text-text-muted text-xl whitespace-pre">
                    {"  "}({pastEvents.length})
                </span>
            </p>
            <div className="flex flex-col gap-2">
                {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}
