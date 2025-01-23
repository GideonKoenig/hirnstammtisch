"use client";

import { type Topic } from "./types";
import { Trash2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import {
    deleteTopic,
    updateTopicDescription,
    updateTopicSpeaker,
} from "~/components/topics/db";
import { useRouter } from "next/navigation";
import { ComboBox } from "~/components/ui/combobox";
import EditableTextFieldClient from "~/components/ui/editable-text-field/editable-text-field-client";
import React from "react";

export function TopicList(props: { topics: Topic[]; users: string[] }) {
    const [showUsed, setShowUsed] = useState<boolean>(false);
    const router = useRouter();

    const topicsFiltered = props.topics.filter(
        (topic) => showUsed || !topic.eventAt,
    );

    if (!topicsFiltered || topicsFiltered.length < 1) {
        return (
            <>
                <div className="flex flex-row items-center gap-1 pl-4">
                    <Checkbox
                        onCheckedChange={(checked: boolean) =>
                            setShowUsed(checked)
                        }
                    />
                    <p className="text-sm">Show already scheduled topics.</p>
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                    <p>No new suggestions.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-row items-center gap-1 pl-4">
                <Checkbox
                    onCheckedChange={(checked: boolean) => setShowUsed(checked)}
                />
                <p className="text-sm">Show already scheduled topics.</p>
            </div>

            <div className="mr-4 grid w-full grid-cols-[170px_auto_1.75rem] items-center gap-2 gap-x-4 pb-6">
                {topicsFiltered.map((topic, index) => (
                    <React.Fragment key={topic.id}>
                        <Separator
                            data-state={index === 0 ? "hide" : "show"}
                            className="col-span-3 data-[state=hide]:hidden"
                        />

                        <ComboBox
                            className={topic.eventAt ? "opacity-50" : ""}
                            initialValue={topic.speaker}
                            setState={(value: string) => {
                                void updateTopicSpeaker({
                                    id: topic.id,
                                    speaker: value,
                                }).then(() => {
                                    router.refresh();
                                });
                            }}
                            options={props.users}
                        />

                        <EditableTextFieldClient
                            data-state={topic.eventAt ? "planned" : ""}
                            className="rounded data-[state=planned]:opacity-50"
                            callback={async (oldValue, newValue) => {
                                await updateTopicDescription({
                                    id: topic.id,
                                    description: newValue,
                                });
                            }}
                            initialContent={topic.description}
                        />

                        <button
                            data-state={topic.eventAt ? "planned" : ""}
                            className="bg-accent-main hover:bg-accent-dark rounded-lg hover:text-text-muted data-[state=planned]:opacity-50"
                            onClick={async () => {
                                await deleteTopic({
                                    id: topic.id,
                                });
                                router.refresh();
                            }}
                        >
                            <Trash2 className="h-7 w-7 p-2" />
                        </button>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}
