import { redirect } from "next/navigation";
import { EventList } from "~/components/event-list";
import { readCookie } from "~/server/utils";

export default async function EventPage() {
    const userName = await readCookie("username");
    if (!userName) {
        redirect("/login");
    }

    return (
        <div className="flex h-full w-full flex-col">
            <EventList />
        </div>
    );
}
