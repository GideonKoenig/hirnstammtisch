import { type ClientUser } from "@/lib/types";
import { type ClientEvent } from "@/lib/types";
import { RoleBadge } from "@/components/ui/role-badge";
import { formatWeekDistance } from "@/lib/date";
import { UserAvatar } from "@/components/ui/user-avatar";

export function MemberCard(props: { user: ClientUser; events: ClientEvent[] }) {
    const sortedEvents = props.events
        .filter((event) => event.date)
        .sort((a, b) => a.date!.getTime() - b.date!.getTime());

    return (
        <div className="border-border bg-surface/60 relative flex flex-col gap-4 rounded-xl border p-6 backdrop-blur-md">
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-[var(--color-accent)]/15 to-transparent"
            />
            <div className="flex h-20 items-start gap-4 lg:h-24">
                <UserAvatar
                    userId={props.user.id}
                    className="h-20 w-20 lg:h-24 lg:w-24"
                    fallbackClassName="h-8 w-8 lg:h-12 lg:w-12"
                    alt={props.user.name}
                />

                <div className="flex h-full min-w-0 grow flex-col gap-1">
                    <h3 className="text-xl font-semibold">{props.user.name}</h3>
                    <RoleBadge role={props.user.role} />
                    <div className="grow" />
                    <p className="text-text-muted text-sm">
                        {"Member since "}
                        {props.user.createdAt.toLocaleDateString("de-DE", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {sortedEvents.length > 0 && (
                <div>
                    <h4 className="mb-3 font-medium">Hosted Events</h4>
                    <div className="flex flex-col gap-2">
                        {sortedEvents.map((event) => (
                            <div
                                key={event.id}
                                className="border-border bg-bg/60 relative rounded-lg border p-3 backdrop-blur-sm"
                            >
                                <p className="font-medium">{event.title}</p>
                                <p className="text-text-muted text-sm">
                                    {event.date!.toLocaleDateString("de-DE", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}{" "}
                                    ({formatWeekDistance(event.date)})
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
