import { EventCard } from "@/components/events/event-item";
import { api } from "@/trpc/server";
import { PageHeader } from "@/components/ui/page-header";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "HirnstammTisch",
    description:
        "Join upcoming HirnstammTisch talks and explore our archive of past sessions.",
    alternates: { canonical: "/" },
    openGraph: {
        title: "HirnstammTisch",
        description:
            "Discover upcoming events and browse past sessions from the HirnstammTisch community.",
        url: "https://hirnstammtisch.com/",
    },
};

export default async function HomePage() {
    const events = await api.event.getAll();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentEvents = events
        .filter((event) => event.date !== null)
        .filter((event) => event.date!.getTime() >= today.getTime())
        .sort((a, b) => a.date!.getTime() - b.date!.getTime());

    const pastEvents = events
        .filter((event) => event.date !== null)
        .filter((event) => event.date!.getTime() < today.getTime())
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());

    return (
        <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
            <PageHeader
                title="HirnstammTisch"
                subtitle="Join upcoming talks and explore our archive of past sessions."
                className="mb-6 md:mb-8"
            />

            <section className="mb-4 md:mb-6">
                <div className="mb-2 flex items-center gap-2 md:mb-3">
                    <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                        Current Events
                    </h2>
                    <span className="border-border bg-bg-muted/60 text-text-muted rounded-full border px-2 py-0.5 text-xs">
                        {currentEvents.length}
                    </span>
                </div>
                <div className="flex flex-col gap-3">
                    {currentEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </section>

            <section>
                <div className="mb-2 flex items-center gap-2 md:mb-3">
                    <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                        Past Events
                    </h2>
                    <span className="border-border bg-bg-muted/60 text-text-muted rounded-full border px-2 py-0.5 text-xs">
                        {pastEvents.length}
                    </span>
                </div>
                <div className="flex flex-col gap-3">
                    {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </section>
        </div>
    );
}
