"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { parseJson } from "~/utils/zod";
import { TopicSchema } from "./types";
import { Trash2, Check } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { ScrollArea, useDynamicHeight } from "~/components/ui/scroll-area";
import { deleteTopic, markUsedTopic } from "~/components/topics/db";

export function TopicList() {
    const [showUsed, setShowUsed] = useState<boolean>(false);

    const ref = useDynamicHeight();

    const queryClient = useQueryClient();
    const { data: topics, isLoading } = useQuery({
        queryKey: ["topics"],
        queryFn: async () => {
            const res = await fetch("/api/topics", { cache: "no-store" });

            if (!res.ok) {
                throw new Error("Failed to fetch topics");
            }

            const topicsRaw = await res.text();
            const topics = parseJson(z.object({ topics: z.array(TopicSchema) }), topicsRaw);
            if (!topics.success) {
                console.log(topics.errors);
                throw new Error("Failed to fetch topics");
            }

            return topics.data.topics;
        },
    });

    const topicsFiltered = topics?.filter(
        (topic) => topic.status === "open" || (topic.status === "used" && showUsed),
    );

    if (isLoading) {
        return (
            <div className="flex w-full flex-col items-center justify-center">
                <LoaderCircle className="h-9 w-9 animate-spin stroke-text-muted stroke-2" />
            </div>
        );
    }

    if (!topicsFiltered || topicsFiltered.length < 1) {
        return (
            <>
                <div className="flex flex-row items-center gap-1 pl-4">
                    <Checkbox onCheckedChange={(checked: boolean) => setShowUsed(checked)} />
                    <p className="text-sm">Show already used topics.</p>
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                    <p>No suggestions yet.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-row items-center gap-1 pl-4">
                <Checkbox onCheckedChange={(checked: boolean) => setShowUsed(checked)} />
                <p className="text-sm">Show already used topics.</p>
            </div>
            <ScrollArea ref={ref}>
                <div className="mr-4 grid grid-cols-[170px_auto_1.75rem_1.75rem] items-center gap-2 pb-6">
                    {topicsFiltered.map((topic, index) => (
                        <>
                            <Separator
                                data-state={index === 0 ? "hide" : "show"}
                                className="col-span-4 data-[state=hide]:hidden"
                            />

                            <p className="px-2 py-1 text-sm text-text-muted">{topic.for}</p>

                            <p
                                data-state={topic.status}
                                className="rounded p-2 data-[state=used]:text-text-muted"
                            >
                                {topic.description}
                            </p>

                            <button
                                className="rounded-lg bg-menu-hover hover:bg-menu-light hover:text-text-muted disabled:opacity-0"
                                disabled={topic.status === "used"}
                                onClick={async () => {
                                    await markUsedTopic({
                                        id: topic.id,
                                    });
                                    await queryClient.invalidateQueries({
                                        queryKey: ["topics"],
                                        exact: true,
                                    });
                                }}
                            >
                                <Check className="h-7 w-7 p-2" />
                            </button>

                            <button
                                className="rounded-lg bg-accent-main hover:bg-accent-dark hover:text-text-muted"
                                onClick={async () => {
                                    await deleteTopic({
                                        id: topic.id,
                                    });
                                    await queryClient.invalidateQueries({
                                        queryKey: ["topics"],
                                        exact: true,
                                    });
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
