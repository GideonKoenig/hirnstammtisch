"use client";

import { useData } from "~/components/data-provider";
import { UserCard } from "~/components/user-card";

export const UserList = () => {
    const { events } = useData({
        prepareEvents: (events) =>
            events
                .filter((event) => event.eventAt !== null)
                .filter((event) => event.eventAt !== undefined),
    });

    const { users } = useData({
        prepareUsers: (users) =>
            users
                .filter((user) =>
                    events.some((event) => event.speaker === user.id),
                )
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    });

    return users.map((user) => <UserCard key={user.id} user={user} />);
};
