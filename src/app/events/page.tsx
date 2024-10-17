import { ne } from "drizzle-orm";
import EventCalendar from "~/components/events/calendar";
import EventList from "~/components/events/list";
import { type Topic } from "~/components/topics/types";
import { NavigationBar } from "~/components/ui/navigation-menu";
import { db } from "~/server/db";
import { topics } from "~/server/db/schema";

export default async function EventPage() {
    const events = (
        await db.query.topics.findMany({
            where: ne(topics.status, "deleted"),
        })
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as unknown as Topic[];

    return (
        <div>
            <NavigationBar />
            <div className="m-auto flex h-full max-w-[1200px] flex-col gap-6 p-6 pb-0">
                <h1 className="text-4xl font-bold">Events</h1>

                <p className="whitespace-pre">
                    {
                        "Here you find an overview over past events and events that are alredy planned for the future."
                    }
                </p>

                <div className="flex flex-row gap-8">
                    <div className="flex-grow">
                        <EventList events={events} />
                    </div>

                    <div className="flex w-[400px] flex-col gap-4">
                        <EventCalendar
                            events={events}
                            className="border-menu-light bg-menu-main shadow shadow-menu-dark"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
