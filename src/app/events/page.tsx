import { not } from "drizzle-orm";
import { cookies } from "next/headers";
import { DEFAULT_USER } from "~/components/newComponents/data-types";
import { EventList } from "~/components/newComponents/event-list";
import { type Topic } from "~/components/topics/types";
import { db } from "~/server/db";
import { EventsTable } from "~/server/db/schema";

export default async function EventPage() {
    const [eventsRaw, users] = await Promise.all([
        db.query.EventsTable.findMany({
            where: not(EventsTable.deleted),
        }),
        db.query.UserTable.findMany(),
    ]);
    const userName = cookies().get("username")?.value;

    const events = eventsRaw.sort((a, b) => {
        const speakerA = users.find((user) => user.id === a.speaker)!;
        const speakerB = users.find((user) => user.id === b.speaker)!;

        // Check if either speaker is the current user
        const isASpeakerCurrentUser = speakerA.name === userName;
        const isBSpeakerCurrentUser = speakerB.name === userName;

        // Current user's events should come first
        if (isASpeakerCurrentUser && !isBSpeakerCurrentUser) return -1;
        if (!isASpeakerCurrentUser && isBSpeakerCurrentUser) return 1;

        // If same speaker, sort by creation date
        if (a.speaker === b.speaker) {
            return a.createdAt.getTime() - b.createdAt.getTime();
        }

        // Otherwise sort alphabetically by speaker name
        return speakerA.id - speakerB.id;
    }) as Topic[];

    users.push(DEFAULT_USER);

    return (
        <div className="flex h-full w-full flex-col">
            <EventList events={events} users={users} />
        </div>
    );
}
