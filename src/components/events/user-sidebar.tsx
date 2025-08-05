"use client";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export function UserSidebar(props: { className?: string }) {
    const { data: events = [], error: eventsError } =
        api.event.getAll.useQuery();
    const { data: users = [], error: usersError } = api.user.getAll.useQuery();

    if (eventsError) toast.error(eventsError.message);
    if (usersError) toast.error(usersError.message);

    const elements = events
        .map((e) => users.filter((u) => u.id === e.speaker))
        .flat()
        .filter(
            (user, index, self) =>
                self.findIndex((u) => u.id === user.id) === index,
        );

    return (
        <div className={cn("flex flex-col gap-2", props.className)}>
            <h3 className="text-text-muted mb-2 text-sm font-semibold">
                Speakers
            </h3>
            <div className="flex flex-col gap-1">
                {elements.map((user) => (
                    <a
                        key={user.id}
                        href={`#user-${user.id}`}
                        className="text-text-muted hover:text-accent block truncate text-sm hover:underline"
                    >
                        {user.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
