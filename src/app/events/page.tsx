import { DEFAULT_USER } from "~/lib/data-types";
import { EventList } from "~/components/event-list";
import { type Event } from "~/lib/data-types";
import { db } from "~/server/db";
import { readCookie } from "~/server/utils";

export default async function EventPage() {
    const [eventsRaw, users] = await Promise.all([
        db.query.EventsTable.findMany({
            where: (events, { eq }) => eq(events.deleted, false),
        }),
        db.query.UserTable.findMany(),
    ]);
    const userName = readCookie("username");

    const events: Event[] = eventsRaw.sort((a, b) => {
        const speakerA = users.find((user) => user.id === a.speaker)!;
        const speakerB = users.find((user) => user.id === b.speaker)!;

        // Check if either event is new
        if (a.description === "New event") return -1;
        if (b.description === "New event") return 1;

        // Check if either speaker is the current user
        const isASpeakerCurrentUser = speakerA.name === userName;
        const isBSpeakerCurrentUser = speakerB.name === userName;

        // Current user's events should come first
        if (isASpeakerCurrentUser && !isBSpeakerCurrentUser) return -1;
        if (!isASpeakerCurrentUser && isBSpeakerCurrentUser) return 1;

        // If same speaker, sort by creation date
        if (a.speaker === b.speaker) {
            return b.createdAt.getTime() - a.createdAt.getTime();
        }

        // Otherwise sort by speaker id
        return speakerA.id - speakerB.id;
    });

    users.push(DEFAULT_USER);

    return (
        <div className="flex h-full w-full flex-col">
            <EventList events={events} users={users} />
        </div>
    );
}
