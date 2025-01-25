"use client";

import { useState } from "react";
import { type User, type Event } from "../lib/data-types";
import { EventForm } from "~/components/event-form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { ComboBox } from "~/components/ui/combobox";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { addEvent } from "~/lib/server-actions";
import { readCookie } from "~/lib/utils";
import { useStatus } from "~/components/status-provider";

export function EventList(props: { events: Event[]; users: User[] }) {
    const { isOffline } = useStatus();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [speaker, setSpeaker] = useState<string>("Anyone");
    const [showAll, setShowAll] = useState<boolean>(false);
    const events = showAll
        ? props.events
        : props.events.filter((event) => {
              if (!event.eventAt) return true;
              const eventDate = event.eventAt;
              const today = new Date();

              eventDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);

              return eventDate >= today;
          });

    const filteredEvents = events
        .filter((event) =>
            event.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .filter((event) => {
            if (speaker === "Anyone") return true;
            const speakerId = props.users.find(
                (user) => user.name === speaker,
            )?.id;
            return event.speaker === speakerId;
        });

    const currentUserName = readCookie("username")!;
    const currentUser: User = props.users.find(
        (user) => user.name === currentUserName,
    )!;

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
                    className="col-span-2 w-full rounded-xl border border-menu-light bg-menu-dark p-2 px-3 shadow-sm shadow-menu-dark placeholder:text-text-muted/80 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="flex max-w-60 flex-row items-center gap-1">
                    <ComboBox
                        className="w-full text-text-muted"
                        initialValue={speaker}
                        onChange={setSpeaker}
                        options={props.users
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
                        className="h-6 w-6 p-1 text-text-muted"
                        onClick={() => setSpeaker("Anyone")}
                    >
                        <X />
                    </Button>
                </div>

                <div className="flex flex-row gap-2">
                    <Switch
                        disabled={isOffline}
                        className="ml-2 bg-menu-light disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50"
                        checked={showAll}
                        onCheckedChange={setShowAll}
                    />
                    <p
                        data-offline={isOffline}
                        className="text-sm text-text-muted data-[offline=true]:cursor-not-allowed data-[offline=true]:opacity-50"
                    >
                        Show all events
                    </p>
                </div>
            </div>

            <Separator className="max-w-3xl bg-menu-hover" />

            <ScrollArea className="h-full w-full p-4 py-0">
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 py-4 md:grid-cols-2">
                    {filteredEvents.map((event) => (
                        <EventForm
                            key={event.id}
                            event={event}
                            users={props.users}
                        />
                    ))}
                </div>
            </ScrollArea>

            <Button
                data-offline={isOffline}
                className="absolute bottom-4 right-4 bg-accent shadow-lg shadow-menu-dark hover:bg-accent/80"
                disabled={isOffline}
                onMouseDown={() => {
                    void addEvent({
                        description: "New event",
                        speaker: currentUser.id,
                        suggestedBy: currentUser.id,
                        deleted: false,
                    });
                }}
            >
                + Add Event
            </Button>
        </div>
    );
}
