import UserCard from "~/components/newComponents/user-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { db } from "~/server/db";

export default async function About() {
    const [events, userListRaw] = await Promise.all([
        db.query.TopicsTable.findMany({
            where: (topics, { isNotNull }) => isNotNull(topics.eventAt),
        }),

        db.query.UserTable.findMany(),
    ]);

    const userList = userListRaw
        .filter((user) => events.some((event) => event.speaker === user.id))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return (
        <ScrollArea className="h-full w-full">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4 p-2">
                <p className="text-2xl font-bold">About</p>
                <p>
                    The HirnstammTisch is a small group of people who meet
                    regularly to discuss interesting topics. We meet every
                    Tuesday at 19:00 at Gideon&apos;s place.
                </p>

                <div className="h-4" />

                <p className="pb-2 text-2xl font-bold">Members</p>

                {userList.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </ScrollArea>
    );
}
