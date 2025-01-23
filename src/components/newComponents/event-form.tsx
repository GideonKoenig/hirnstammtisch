"use client";

import { ComboBox } from "~/components/ui/combobox";
import { readCookie } from "~/components/utils";
import {
    DEFAULT_USER,
    type Event,
} from "~/components/newComponents/data-types";
import { type User } from "~/components/newComponents/data-types";
import EditableTextField from "~/components/newComponents/editable-text-field";
import { updateEvent } from "~/components/newComponents/actions";
import { Separator } from "~/components/ui/separator";
import { DatePicker } from "~/components/newComponents/date-picker";

export function EventForm(props: { event: Event; user: User[] }) {
    const currentUserName = readCookie("username")!;
    const eventUser = props.user.find(
        (user) => user.id === props.event.speaker,
    );

    return (
        <div className="flex w-full flex-col gap-2 rounded-lg border border-menu-hover bg-menu-light p-2 shadow shadow-menu-dark">
            <EditableTextField
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
                    initialValue={eventUser?.name ?? DEFAULT_USER.name}
                    onChange={(value) => {
                        const newSpeaker = props.user.find(
                            (user) => user.name === value,
                        )?.id;
                        if (newSpeaker) {
                            void updateEvent(props.event.id, {
                                ...props.event,
                                speaker: newSpeaker,
                            });
                        }
                    }}
                    options={props.user.map((user) => user.name)}
                    sortOptions
                />

                <p className="text-sm text-text-muted">Suggested By:</p>
                <ComboBox
                    className="w-full"
                    initialValue={eventUser?.name ?? DEFAULT_USER.name}
                    onChange={(value) => {
                        const newSuggestedBy = props.user.find(
                            (user) => user.name === value,
                        )?.id;
                        if (newSuggestedBy) {
                            void updateEvent(props.event.id, {
                                ...props.event,
                                suggestedBy: newSuggestedBy,
                            });
                        }
                    }}
                    options={props.user.map((user) => user.name)}
                    sortOptions
                />

                <p className="text-sm text-text-muted">Event Date:</p>
                <DatePicker
                    initialValue={props.event.eventAt}
                    className="border border-menu-hover bg-menu-dark shadow shadow-menu-dark hover:bg-menu-dark focus:bg-menu-dark"
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
            </div>
        </div>
    );
}
