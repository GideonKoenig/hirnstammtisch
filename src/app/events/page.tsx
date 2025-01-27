import { EventList } from "~/components/event-list";

export default async function EventPage() {
    return (
        <div className="flex h-full w-full flex-col">
            <EventList />
        </div>
    );
}
