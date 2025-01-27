"use client";

import { useData } from "~/components/data-provider";
import { type User } from "~/lib/data-types";
import { formatWeekDistance } from "~/lib/date";
import Image from "next/image";

export function UserCard(props: { user: User }) {
    const { events } = useData({
        prepareEvents: (events) =>
            events
                .filter((event) => event.eventAt !== null)
                .filter((event) => event.eventAt !== undefined)
                .filter((event) => event.speaker === props.user.id)
                .sort((a, b) => a.eventAt!.getTime() - b.eventAt!.getTime()),
    });

    return (
        <div className="border-menu-hover bg-menu-light shadow-menu-dark grid grid-cols-[auto_140px] gap-4 rounded-lg border p-2 shadow-sm md:grid-cols-[auto_180px]">
            <div className="flex flex-col">
                <h2 className="text-lg font-bold">{props.user.name}</h2>
                <p className="text-text-muted text-xs whitespace-pre">
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
                            <p className="text-text-muted text-xs whitespace-pre">
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
                        sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px"
                        className="shadow-menu-dark rounded-lg object-cover shadow-sm"
                    />
                </div>
            ) : (
                <div className="bg-menu-hover shadow-menu-dark flex h-[160px] w-[140px] items-center justify-center rounded-lg shadow-sm md:h-[220px] md:w-[180px]">
                    <p className="text-text-muted flex h-full w-full items-center justify-center text-[100px]">
                        ?
                    </p>
                </div>
            )}

            <div className="col-span-2 flex flex-col gap-4 md:hidden">
                {events.map((event) => (
                    <div className="flex flex-col" key={event.id}>
                        <p className="text-sm">{event.description}</p>
                        <p className="text-text-muted text-xs whitespace-pre">
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
