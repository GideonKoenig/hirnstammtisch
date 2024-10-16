"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { parseJson } from "~/utils/zod";
import { TopicSchema } from "./types";
import { Trash2, Check } from "lucide-react";
import { updateTopic } from "./db";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";

export function TopicList() {
    const [showUsed, setShowUsed] = useState<boolean>(false);
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

    if (isLoading)
        return (
            <div className="flex w-full flex-col items-center justify-center">
                <LoaderCircle className="h-9 w-9 animate-spin stroke-text-muted stroke-2" />
            </div>
        );

    const topicsFiltered = topics?.filter(
        (topic) => topic.status === "open" || (topic.status === "used" && showUsed),
    );

    if (!topicsFiltered || topicsFiltered.length < 1)
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

    return (
        <>
            <div className="flex flex-row items-center gap-1 pl-4">
                <Checkbox onCheckedChange={(checked: boolean) => setShowUsed(checked)} />
                <p className="text-sm">Show already used topics.</p>
            </div>
            <div className="grid grid-cols-[170px_auto_1.75rem_1.75rem] items-center gap-2">
                <>
                    <p className="px-2 py-1 text-sm text-text-muted">{topicsFiltered[0]!.for}</p>

                    <p
                        data-state={topicsFiltered[0]!.status}
                        className="rounded p-2 data-[state=used]:text-text-muted"
                    >
                        {topicsFiltered[0]!.description}
                    </p>

                    <button
                        className="rounded-lg bg-menu-hover hover:bg-menu-light hover:text-text-muted disabled:opacity-0"
                        disabled={topicsFiltered[0]!.status === "used"}
                        onClick={async () => {
                            await updateTopic({
                                id: topicsFiltered[0]!.id,
                                status: "used",
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
                        className="bg-accent-main hover:bg-accent-dark rounded-lg hover:text-text-muted"
                        onClick={async () => {
                            await updateTopic({
                                id: topicsFiltered[0]!.id,
                                status: "deleted",
                            });
                            await queryClient.invalidateQueries({
                                queryKey: ["topicsFiltered"],
                                exact: true,
                            });
                        }}
                    >
                        <Trash2 className="h-7 w-7 p-2" />
                    </button>
                </>
                {topicsFiltered.slice(1).map((topic) => (
                    <>
                        <Separator className="col-span-4" />

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
                                await updateTopic({
                                    id: topic.id,
                                    status: "used",
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
                            className="bg-accent-main hover:bg-accent-dark rounded-lg hover:text-text-muted"
                            onClick={async () => {
                                await updateTopic({
                                    id: topic.id,
                                    status: "deleted",
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
        </>
    );
}
