"use client";

import { useState } from "react";
import { type User, type Event, DEFAULT_USER } from "./data-types";
import { EventForm } from "~/components/newComponents/event-form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { ComboBox } from "~/components/ui/combobox";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function EventList(props: { events: Event[]; users: User[] }) {
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

    return (
        <div className="relative flex h-full w-full flex-col items-center">
            <div className="grid w-full max-w-3xl grid-cols-[auto_10rem] items-center gap-4 gap-x-6 p-3">
                <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    type="text"
                    placeholder="Looking for an event?"
                    className="col-span-2 w-full rounded-xl border border-menu-light bg-menu-dark p-2 px-3 shadow shadow-menu-dark placeholder:text-text-muted/80 focus-visible:outline-none"
                />

                <div className="flex max-w-60 flex-row items-center gap-1">
                    <ComboBox
                        className="w-full text-text-muted"
                        initialValue={speaker}
                        onChange={setSpeaker}
                        options={props.users.map((user) => user.name)}
                        sortOptions
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-text-muted"
                        onClick={() => setSpeaker("Anyone")}
                    >
                        <X />
                    </Button>
                </div>

                <div className="flex flex-row gap-2">
                    <p className="text-sm text-text-muted">Show all events</p>
                    <Switch
                        className="ml-2 bg-menu-light"
                        checked={showAll}
                        onCheckedChange={setShowAll}
                    />
                </div>
            </div>

            <Separator className="max-w-3xl bg-menu-hover" />

            <ScrollArea className="h-full w-full overflow-hidden p-4 py-0">
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 py-4 lg:grid-cols-2">
                    {filteredEvents.map((event) => (
                        <EventForm
                            key={event.id}
                            event={event}
                            user={props.users}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
