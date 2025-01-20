import EventCard from "~/components/events/event-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { db } from "~/server/db";
import { getWeekDistance } from "~/utils/date";

export default async function HomePage() {
    const events = await db.query.TopicsTable.findMany({
        where: (topics, { isNotNull }) => isNotNull(topics.eventAt),
    });

    const curentEvents = events
        .filter((event) => {
            const weekDistance = getWeekDistance(event.eventAt!);
            return weekDistance >= -1;
        })
        .sort((a, b) => a.eventAt!.getTime() - b.eventAt!.getTime());

    const pastEvents = events
        .filter((event) => {
            const weekDistance = getWeekDistance(event.eventAt!);
            return weekDistance < -1;
        })
        .sort((a, b) => b.eventAt!.getTime() - a.eventAt!.getTime());

    return (
        <ScrollArea className="h-full w-full">
            <div className="flex h-full w-full flex-col gap-4 p-4">
                <p className="text-2xl font-bold">Current Events</p>
                {curentEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}

                <p className="pt-4 text-2xl font-bold">Past Events</p>
                {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
                <div className="flex-grow" />
            </div>
        </ScrollArea>
    );
}
