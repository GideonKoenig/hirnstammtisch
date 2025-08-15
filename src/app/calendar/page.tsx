import { EventModal } from "@/components/events/event-modal";
import { EventContextProvider } from "@/components/events/event-context";
import { api, HydrateClient } from "@/trpc/server";
import { CalendarView } from "@/components/calendar/calendar-view";
import { PageHeader } from "@/components/ui/page-header";
import { type Metadata } from "next";
import { env } from "@/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Calendar",
    description: "See all HirnstammTisch events on a monthly calendar view.",
    alternates: { canonical: "/calendar" },
    openGraph: {
        title: "Event Calendar - HirnstammTisch",
        description: "Browse HirnstammTisch events by date on the calendar.",
        url: `${env.SITE_URL}/calendar`,
    },
};

export default async function CalendarPage() {
    void api.user.getAll.prefetch();
    void api.event.getAll.prefetch();

    return (
        <HydrateClient>
            <EventContextProvider>
                <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
                    <PageHeader
                        title="Event Calendar"
                        subtitle="Click on any day to see events scheduled for that date"
                        className="mb-6 md:mb-8"
                    />
                    <CalendarView />
                    <EventModal />
                </div>
            </EventContextProvider>
        </HydrateClient>
    );
}
