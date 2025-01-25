"use client";

import { ComboBox } from "~/components/ui/combobox";
import { cn } from "~/lib/utils";
import { DEFAULT_USER, type Event } from "~/lib/data-types";
import { type User } from "~/lib/data-types";
import EditableTextField from "~/components/editable-text-field";
import { deleteEvent, updateEvent } from "~/lib/server-actions";
import { Separator } from "~/components/ui/separator";
import { DatePicker } from "~/components/ui/date-picker";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";
import { useStatus } from "~/components/status-provider";

export function EventForm(props: {
    event: Event;
    users: User[];
    className?: string;
}) {
    const { isOffline } = useStatus();
    const eventSpeaker = props.users.find(
        (user) => user.id === props.event.speaker,
    );
    const eventSuggestedBy = props.users.find(
        (user) => user.id === props.event.suggestedBy,
    );

    return (
        <div
            className={cn(
                "relative flex w-full flex-col gap-2 rounded-lg border border-menu-hover bg-menu-light p-2 shadow-sm shadow-menu-dark",
                props.className,
            )}
        >
            <div className="absolute -right-2 -top-4 lg:-right-4">
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
                <p className="text-sm text-text-muted">Speaker:</p>
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

                <p className="text-sm text-text-muted">Suggested By:</p>
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

                <p className="text-sm text-text-muted">Event Date:</p>
                <DatePicker
                    initialValue={props.event.eventAt}
                    className="border border-menu-hover bg-menu-dark shadow-sm shadow-menu-dark hover:bg-menu-dark focus:bg-menu-dark"
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

                <p className="text-sm text-text-muted">Presentation URL:</p>
                <EditableTextField
                    hideButton
                    className="max-h-6 w-full"
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
