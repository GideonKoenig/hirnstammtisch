"use client";

import { useState } from "react";
import { type Topic } from "~/components/topics/types";
import { ScrollArea, useDynamicHeight } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export default function EventList(props: { events: Topic[] }) {
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const ref = useDynamicHeight();

    return (
        <div className="flex flex-col gap-4">
            <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={(event) => event.target.select()}
                type="text"
                placeholder="Search..."
                className="w-full rounded border border-menu-light bg-menu-dark px-3 py-1 shadow shadow-menu-dark placeholder:text-text-muted focus-visible:outline-none"
            />
            <ScrollArea className="h-0" ref={ref}>
                <div className="mr-4 grid grid-cols-[170px_auto] items-center gap-2 pb-6">
                    {props.events.map((event, index) => (
                        <>
                            <Separator
                                data-state={index === 0 ? "hide" : "show"}
                                className="col-span-4 data-[state=hide]:hidden"
                            />

                            <p className="px-2 py-1 text-sm text-text-muted">{event.for}</p>

                            <p
                                data-state={event.status}
                                className="rounded p-2 data-[state=used]:text-text-muted"
                            >
                                {event.description}
                            </p>
                        </>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
