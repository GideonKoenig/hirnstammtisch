import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/server/utils";
import { EventsSearchBar } from "@/components/events/event-search-bar";
import { EventList } from "@/components/events/event-list";
import { EventModal } from "@/components/events/event-modal";
import { EventContextProvider } from "@/components/events/event-context";
import { UserSidebar } from "@/components/events/user-sidebar";
import { api, HydrateClient } from "@/trpc/server";

export default async function Events() {
    const session = await getSession(await headers());
    if (!session?.user) redirect("/signin");

    void api.user.getAll.prefetch();
    void api.event.getAll.prefetch();

    return (
        <HydrateClient>
            <EventContextProvider>
                <div className="relative mx-auto w-full max-w-3xl">
                    <EventsSearchBar className="mb-4" />
                    <div className="sticky top-8 h-0 w-full">
                        <UserSidebar className="absolute right-full mr-8 hidden lg:block" />
                    </div>
                    <EventList showSpeakerNames />
                    <EventModal />
                </div>
            </EventContextProvider>
        </HydrateClient>
    );
}
