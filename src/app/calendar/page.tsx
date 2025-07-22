import { EventModal } from "@/components/events/event-modal";
import { EventContextProvider } from "@/components/events/event-context";
import { api, HydrateClient } from "@/trpc/server";
import { CalendarView } from "@/components/calendar/calendar-view";

export default async function CalendarPage() {
    void api.user.getAll.prefetch();
    void api.event.getAll.prefetch();

    return (
        <HydrateClient>
            <EventContextProvider>
                <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 text-center sm:mb-8 xl:text-left">
                        <h1 className="text-text text-2xl font-bold sm:text-3xl">
                            Event Calendar
                        </h1>
                        <p className="text-text-muted mt-2 text-sm sm:text-base">
                            Click on any day to see events scheduled for that
                            date
                        </p>
                    </div>
                    <CalendarView />
                    <EventModal />
                </div>
            </EventContextProvider>
        </HydrateClient>
    );
}
