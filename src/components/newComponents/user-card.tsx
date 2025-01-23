import { type User } from "~/components/newComponents/data-types";
import { formatWeekDistance } from "~/utils/date";
import Image from "next/image";
import { db } from "~/server/db";

export default async function UserCard(props: { user: User }) {
    const events = await db.query.EventsTable.findMany({
        where: (topics, { isNotNull, eq, and }) => {
            return and(
                isNotNull(topics.eventAt),
                eq(topics.speaker, props.user.id),
            );
        },
        orderBy: (topics, { asc }) => [asc(topics.eventAt)],
    });

    return (
        <div className="grid grid-cols-[auto_140px] gap-4 rounded-lg border border-menu-hover bg-menu-light p-2 shadow shadow-menu-dark md:grid-cols-[auto_180px]">
            <div className="flex flex-col">
                <h2 className="text-lg font-bold">{props.user.name}</h2>
                <p className="whitespace-pre text-xs text-text-muted">
                    {"Mitglied seit "}
                    {props.user.createdAt?.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </p>

                <div className="col-span-2 hidden flex-col gap-4 pt-8 md:flex">
                    {events.map((event) => (
                        <div className="flex flex-col" key={event.id}>
                            <p className="text-sm">{event.description}</p>
                            <p className="whitespace-pre text-xs text-text-muted">
                                {event.eventAt?.toLocaleDateString("de-DE", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                                <span className="text-text-muted">
                                    {"  "}({formatWeekDistance(event.eventAt!)})
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {props.user.imageUrl ? (
                <div className="relative h-[160px] w-[140px] md:h-[220px] md:w-[180px]">
                    <Image
                        src={props.user.imageUrl}
                        alt={props.user.name}
                        fill
                        className="rounded-lg object-cover shadow shadow-menu-dark"
                    />
                </div>
            ) : (
                <div className="flex h-[160px] w-[140px] items-center justify-center rounded-lg bg-menu-hover shadow shadow-menu-dark md:h-[220px] md:w-[180px]">
                    <p className="flex h-full w-full items-center justify-center text-[100px] text-text-muted">
                        ?
                    </p>
                </div>
            )}

            <div className="col-span-2 flex flex-col gap-4 md:hidden">
                {events.map((event) => (
                    <div className="flex flex-col" key={event.id}>
                        <p className="text-sm">{event.description}</p>
                        <p className="whitespace-pre text-xs text-text-muted">
                            {event.eventAt?.toLocaleDateString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                            <span className="text-text-muted">
                                {"  "}({formatWeekDistance(event.eventAt!)})
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
