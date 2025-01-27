"use client";

import { useState } from "react";
import { DEFAULT_USER } from "../lib/data-types";
import { EventForm } from "~/components/event-form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { ComboBox } from "~/components/ui/combobox";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { addEvent } from "~/lib/server-actions";
import { usePwa } from "~/components/pwa-provider";
import { useData } from "~/components/data-provider";

export function EventList() {
    const { isOffline } = usePwa();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [speaker, setSpeaker] = useState<string>("Anyone");
    const [showAll, setShowAll] = useState<boolean>(false);
    const { activeUser, users } = useData({
        prepareUsers: (users) => [...users, DEFAULT_USER],
    });
    const { events } = useData({
        prepareEvents: (events) =>
            events
                .filter((event) => !event.deleted)
                .filter((event) => {
                    if (showAll) return true;
                    if (event.eventAt === undefined) return true;
                    if (event.eventAt === null) return true;

                    const eventDate = event.eventAt;
                    const today = new Date();

                    eventDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    return eventDate >= today;
                })
                .filter((event) =>
                    event.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                )
                .filter((event) => {
                    if (speaker === "Anyone") return true;
                    const speakerId = users.find(
                        (user) => user.name === speaker,
                    )?.id;
                    return event.speaker === speakerId;
                })
                .sort((a, b) => {
                    const speakerA = users.find(
                        (user) => user.id === a.speaker,
                    )!;
                    const speakerB = users.find(
                        (user) => user.id === b.speaker,
                    )!;

                    // Check if either event is new
                    if (a.description === "New event") return -1;
                    if (b.description === "New event") return 1;

                    // Check if either speaker is the current user
                    const isASpeakerCurrentUser =
                        speakerA.name === activeUser?.name;
                    const isBSpeakerCurrentUser =
                        speakerB.name === activeUser?.name;

                    // Current user's events should come first
                    if (isASpeakerCurrentUser && !isBSpeakerCurrentUser)
                        return -1;
                    if (!isASpeakerCurrentUser && isBSpeakerCurrentUser)
                        return 1;

                    // If same speaker, sort by creation date
                    if (a.speaker === b.speaker) {
                        return b.createdAt.getTime() - a.createdAt.getTime();
                    }

                    // Otherwise sort by speaker id
                    return speakerA.id - speakerB.id;
                }),
    });

    return (
        <div className="relative flex h-full w-full flex-col items-center">
            <div className="grid w-full max-w-3xl grid-cols-[auto_10rem] items-center gap-4 gap-x-6 p-3">
                <input
                    value={searchTerm}
                    disabled={isOffline}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    type="text"
                    placeholder="Looking for an event?"
                    className="border-menu-light bg-menu-dark shadow-menu-dark placeholder:text-text-muted/80 col-span-2 w-full rounded-xl border p-2 px-3 shadow-sm focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="flex max-w-60 flex-row items-center gap-1">
                    <ComboBox
                        className="text-text-muted w-full"
                        initialValue={speaker}
                        onChange={setSpeaker}
                        options={users
                            .filter((user) =>
                                events.some(
                                    (event) => event.speaker === user.id,
                                ),
                            )
                            .map((user) => user.name)}
                        sortOptions
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-text-muted h-6 w-6 p-1"
                        onClick={() => setSpeaker("Anyone")}
                    >
                        <X />
                    </Button>
                </div>

                <div className="flex flex-row gap-2">
                    <Switch
                        disabled={isOffline}
                        className="bg-menu-light ml-2 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50"
                        checked={showAll}
                        onCheckedChange={setShowAll}
                    />
                    <p
                        data-offline={isOffline}
                        className="text-text-muted text-sm data-[offline=true]:cursor-not-allowed data-[offline=true]:opacity-50"
                    >
                        Show all events
                    </p>
                </div>
            </div>

            <Separator className="bg-menu-hover max-w-3xl" />

            <ScrollArea className="h-full w-full p-4 py-0">
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 py-4 md:grid-cols-2">
                    {events.map((event) => (
                        <EventForm
                            key={event.id}
                            event={event}
                            events={events}
                            users={users}
                        />
                    ))}
                </div>
            </ScrollArea>

            <Button
                data-offline={isOffline}
                className="bg-accent shadow-menu-dark hover:bg-accent/80 absolute right-4 bottom-4 shadow-lg"
                disabled={isOffline}
                onMouseDown={() => {
                    void addEvent({
                        description: "New event",
                        speaker: activeUser!.id,
                        suggestedBy: activeUser!.id,
                        deleted: false,
                    });
                }}
            >
                + Add Event
            </Button>
        </div>
    );
}
