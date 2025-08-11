"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatDate } from "@/lib/date";

export function DeletedEventsAdmin(props: { className?: string }) {
    const utils = api.useUtils();
    const { data: events = [], isLoading } = api.event.getDeleted.useQuery();
    const delMut = api.event.deletePermanently.useMutation({
        onSuccess: async () => {
            await utils.event.getDeleted.invalidate();
            toast.success("Event permanently deleted");
        },
        onError: (e) => toast.error(e.message),
    });

    const [search, setSearch] = useState("");
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return events;
        return events.filter((e) =>
            [e.title ?? "", e.speaker].some((v) =>
                v.toLowerCase().includes(term),
            ),
        );
    }, [events, search]);

    return (
        <div className={props.className}>
            <div className="mb-3 grid grid-cols-[1fr_auto] items-center gap-2">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search deleted events"
                    className="h-8"
                />
                <div className="text-text-muted shrink-0 text-xs whitespace-nowrap">
                    {isLoading ? "Loading..." : `${filtered.length} deleted`}
                </div>
            </div>

            <div className="grid gap-2">
                {filtered.map((e) => (
                    <div
                        key={e.id}
                        className="border-border bg-surface flex flex-col gap-2 rounded border p-3 md:flex-row md:items-center md:justify-between"
                    >
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                                {e.title}
                            </div>
                            <div className="text-text-muted truncate text-xs">
                                {e.date
                                    ? formatDate(new Date(e.date), true)
                                    : "No date"}
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => delMut.mutate({ id: e.id })}
                            className="h-8"
                        >
                            Permanently Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
