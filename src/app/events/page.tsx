import { not } from "drizzle-orm";
import EventCalendar from "~/components/events/calendar";
import EventList from "~/components/events/list";
import { type Topic } from "~/components/topics/types";
import { NavigationBar } from "~/components/ui/navigation-menu";
import { db } from "~/server/db";
import { TopicsTable } from "~/server/db/schema";

export default async function EventPage() {
    const events = (
        await db.query.TopicsTable.findMany({
            where: not(TopicsTable.deleted),
        })
    ).sort((a, b) => {
        if (b.eventAt && a.eventAt) {
            return b.eventAt.getTime() - a.eventAt.getTime();
        }
        if (!b.eventAt && !a.eventAt) {
            return b.createdAt.getTime() - a.createdAt.getTime();
        }
        if (!b.eventAt) return 1;
        return -1;
    }) as unknown as Topic[];

    const userList = await db.query.UserTable.findMany();
    userList.push({
        id: -1,
        name: "Anyone",
        createdAt: new Date(0),
    });

    return (
        <div className="flex h-screen flex-col">
            <NavigationBar />
            <div className="m-auto flex h-full max-w-[1000px] flex-grow flex-col gap-6 p-6 pb-0">
                <div className="flex flex-row gap-12">
                    <div className="flex flex-grow flex-col gap-6">
                        <h1 className="text-4xl font-bold">Events</h1>
                        <p>
                            Here you find an overview over past events and events that are already
                            planned for the future.
                            <br />
                            <br />
                            You can also create events, by setting a Event data for a topic.
                        </p>
                    </div>
                    <div className="flex w-[600px] flex-shrink-0 flex-col gap-4">
                        <EventCalendar
                            events={events}
                            className="border-menu-light bg-menu-main shadow shadow-menu-dark"
                        />
                    </div>
                </div>

                <div className="flex-grow">
                    <EventList events={events} users={userList.map((user) => user.name)} />
                </div>
            </div>
        </div>
    );
}
