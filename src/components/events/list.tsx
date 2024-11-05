"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import {
    updateTopicEventDate,
    updateTopicSpeaker,
} from "~/components/topics/db";
import { type Topic } from "~/components/topics/types";
import { Checkbox } from "~/components/ui/checkbox";
import { ComboBox } from "~/components/ui/combobox";
import { DatePicker } from "~/components/ui/date-picker";
import { ScrollArea, useDynamicHeight } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export default function EventList(props: { users: string[]; events: Topic[] }) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showAll, setShowAll] = useState<boolean>(false);

    const router = useRouter();
    const eventsFiltered = props.events.filter(
        (event) =>
            (showAll || event.eventAt) &&
            event.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    eventsFiltered.forEach((event) => event.eventAt?.setHours(23));
    const ref = useDynamicHeight();

    return (
        <div className="flex flex-col gap-4">
            <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={(event) => event.target.select()}
                type="text"
                placeholder="Search..."
                className="w-full rounded border border-menu-light bg-menu-dark p-2 px-3 shadow shadow-menu-dark placeholder:text-text-muted focus-visible:outline-none"
            />

            <div className="flex flex-row items-center gap-1 pl-4">
                <Checkbox
                    onCheckedChange={(checked: boolean) => setShowAll(checked)}
                />
                <p className="text-sm">Show unscheduled topics.</p>
            </div>

            <ScrollArea className="h-0" ref={ref}>
                <div className="mr-4 grid grid-cols-[110px_250px_auto] items-center gap-2 pb-6">
                    {eventsFiltered ? (
                        eventsFiltered.map((event, index) => (
                            <React.Fragment key={index}>
                                <Separator
                                    data-state={index === 0 ? "hide" : "show"}
                                    className="col-span-3 data-[state=hide]:hidden"
                                />

                                <DatePicker
                                    className={
                                        event.eventAt &&
                                        event.eventAt < new Date()
                                            ? "opacity-50"
                                            : ""
                                    }
                                    initialValue={event.eventAt}
                                    label={event.eventAt?.toLocaleDateString(
                                        "de-DE",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        },
                                    )}
                                    onChange={async (date) => {
                                        await updateTopicEventDate({
                                            id: event.id,
                                            eventAt: date,
                                        });
                                        router.refresh();
                                    }}
                                />

                                <ComboBox
                                    className={
                                        event.eventAt &&
                                        event.eventAt < new Date()
                                            ? "opacity-50"
                                            : ""
                                    }
                                    state={event.speaker}
                                    setState={(value: string) => {
                                        void updateTopicSpeaker({
                                            id: event.id,
                                            speaker: value,
                                        }).then(() => {
                                            router.refresh();
                                        });
                                    }}
                                    options={props.users}
                                />

                                <p
                                    data-state={
                                        event.eventAt &&
                                        event.eventAt < new Date()
                                            ? "old"
                                            : "new"
                                    }
                                    className="rounded p-2 data-[state=old]:opacity-50"
                                >
                                    {event.description}
                                </p>
                            </React.Fragment>
                        ))
                    ) : (
                        <div>No entries</div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
