"use client";

import { ComboBox } from "~/components/ui/combobox";
import { cn } from "~/lib/utils";
import { DEFAULT_USER, type Event } from "~/lib/data-types";
import { type User } from "~/lib/data-types";
import EditableTextField from "~/components/ui/editable-text-field";
import { deleteEvent, updateEvent } from "~/lib/server-actions";
import { Separator } from "~/components/ui/separator";
import { DatePicker } from "~/components/ui/date-picker";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";
import { usePwa } from "~/components/pwa-provider";

export function EventForm(props: {
    event: Event;
    events: Event[];
    users: User[];
    className?: string;
}) {
    const { isOffline } = usePwa();
    const eventSpeaker = props.users.find(
        (user) => user.id === props.event.speaker,
    );
    const eventSuggestedBy = props.users.find(
        (user) => user.id === props.event.suggestedBy,
    );

    return (
        <div
            className={cn(
                "border-menu-hover bg-menu-light shadow-menu-dark relative flex w-full flex-col gap-2 rounded-lg border p-2 shadow-sm",
                props.className,
            )}
        >
            <div className="absolute -top-4 -right-2 lg:-right-4">
                <Button
                    disabled={isOffline}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-transparent p-1 hover:bg-transparent disabled:pointer-events-auto disabled:cursor-not-allowed"
                    onMouseDown={() => {
                        void deleteEvent(props.event.id);
                    }}
                >
                    <X className="h-full w-full" />
                </Button>
            </div>

            <EditableTextField
                className="grow"
                value={props.event.description}
                onChange={(newValue) => {
                    void updateEvent(props.event.id, {
                        ...props.event,
                        description: newValue,
                    });
                }}
            />

            <Separator className="bg-menu-hover" />

            <div className="grid grid-cols-2 items-center gap-y-2">
                <p className="text-text-muted text-sm">Speaker:</p>
                <ComboBox
                    className="w-full"
                    initialValue={eventSpeaker?.name ?? DEFAULT_USER.name}
                    onChange={(value) => {
                        const newSpeaker = props.users.find(
                            (user) => user.name === value,
                        )?.id;
                        if (newSpeaker) {
                            void updateEvent(props.event.id, {
                                ...props.event,
                                speaker: newSpeaker,
                            });
                        }
                    }}
                    options={props.users.map((user) => user.name)}
                    sortOptions
                />

                <p className="text-text-muted text-sm">Suggested By:</p>
                <ComboBox
                    className="w-full"
                    initialValue={eventSuggestedBy?.name ?? DEFAULT_USER.name}
                    onChange={(value) => {
                        const newSuggestedBy = props.users.find(
                            (user) => user.name === value,
                        )?.id;
                        if (newSuggestedBy) {
                            void updateEvent(props.event.id, {
                                ...props.event,
                                suggestedBy: newSuggestedBy,
                            });
                        }
                    }}
                    options={props.users.map((user) => user.name)}
                    sortOptions
                />

                <p className="text-text-muted text-sm">Event Date:</p>
                <DatePicker
                    events={props.events}
                    initialValue={props.event.eventAt}
                    className="border-menu-hover bg-menu-dark shadow-menu-dark hover:bg-menu-dark focus:bg-menu-dark border shadow-sm"
                    label={props.event.eventAt?.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                    onChange={(value) => {
                        value?.setHours(23);
                        void updateEvent(props.event.id, {
                            ...props.event,
                            eventAt: value ?? null,
                        });
                    }}
                />

                <p className="text-text-muted text-sm">Presentation URL:</p>
                <EditableTextField
                    hideButton
                    className="max-h-7 w-full"
                    size="sm"
                    placeholder="Insert presentation url"
                    value={props.event.presentationUrl}
                    onChange={(newValue) => {
                        const newUrl = newValue.trim() === "" ? null : newValue;
                        void updateEvent(props.event.id, {
                            ...props.event,
                            presentationUrl: newUrl,
                        });
                    }}
                />
            </div>
        </div>
    );
}
