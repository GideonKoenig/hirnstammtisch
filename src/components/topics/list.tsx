"use client";

import { type Topic } from "./types";
import { Trash2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { ScrollArea, useDynamicHeight } from "~/components/ui/scroll-area";
import { deleteTopic, updateSpeakerTopic } from "~/components/topics/db";
import { useRouter } from "next/navigation";
import { ComboBox } from "~/components/ui/combobox";

export function TopicList(props: { topics: Topic[]; users: string[] }) {
    const [showUsed, setShowUsed] = useState<boolean>(false);
    const ref = useDynamicHeight();
    const router = useRouter();

    const topicsFiltered = props.topics.filter((topic) => showUsed || !topic.eventAt);

    if (!topicsFiltered || topicsFiltered.length < 1) {
        return (
            <>
                <div className="flex flex-row items-center gap-1 pl-4">
                    <Checkbox onCheckedChange={(checked: boolean) => setShowUsed(checked)} />
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
                <Checkbox onCheckedChange={(checked: boolean) => setShowUsed(checked)} />
                <p className="text-sm">Show already scheduled topics.</p>
            </div>
            <ScrollArea ref={ref}>
                <div className="mr-4 grid w-full grid-cols-[170px_auto_1.75rem] items-center gap-2 pb-6">
                    {topicsFiltered.map((topic, index) => (
                        <>
                            <Separator
                                data-state={index === 0 ? "hide" : "show"}
                                className="col-span-3 data-[state=hide]:hidden"
                            />

                            <ComboBox
                                className={topic.eventAt ? "opacity-50" : ""}
                                state={topic.speaker}
                                setState={(value: string) => {
                                    void updateSpeakerTopic({
                                        id: topic.id,
                                        speaker: value,
                                    }).then(() => {
                                        router.refresh();
                                    });
                                }}
                                options={props.users}
                            />

                            <p
                                data-state={topic.eventAt ? "planned" : ""}
                                className="rounded p-2 data-[state=planned]:opacity-50"
                            >
                                {topic.description}
                            </p>

                            <button
                                data-state={topic.eventAt ? "planned" : ""}
                                className="rounded-lg bg-accent-main hover:bg-accent-dark hover:text-text-muted data-[state=planned]:opacity-50"
                                onClick={async () => {
                                    await deleteTopic({
                                        id: topic.id,
                                    });
                                    router.refresh();
                                }}
                            >
                                <Trash2 className="h-7 w-7 p-2" />
                            </button>
                        </>
                    ))}
                </div>
            </ScrollArea>
        </>
    );
}
