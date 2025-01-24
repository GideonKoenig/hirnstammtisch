import EventCalendar from "~/components/event-calendar";
import { db } from "~/server/db";

export default async function CalendarPage() {
    const [events, users] = await Promise.all([
        db.query.EventsTable.findMany({
            where: (events, { not }) => not(events.deleted),
        }),
        db.query.UserTable.findMany(),
    ]);

    return <EventCalendar events={events} users={users} />;
}
