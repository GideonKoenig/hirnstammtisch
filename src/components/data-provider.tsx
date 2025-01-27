"use client";

import { createContext, useContext, useState } from "react";
import { type User, type Event } from "~/lib/data-types";

type ContextType = {
    events: Event[];
    setEvents: (events: Event[]) => void;
    users: User[];
    setUsers: (users: User[]) => void;
    activeUser: User | undefined;
    setActiveUser: (username: string | undefined) => void;
};

const DataContext = createContext<ContextType>({
    events: [],
    users: [],
    activeUser: undefined,
    setEvents: () => {
        console.log("Uninitialized setEvents");
    },
    setUsers: () => {
        console.log("Uninitialized setUsers");
    },
    setActiveUser: () => {
        console.log("Uninitialized setActiveUser");
    },
});

export const useData = (props?: {
    prepareEvents?: (events: Event[]) => Event[];
    prepareUsers?: (users: User[]) => User[];
}) => {
    const context = useContext(DataContext);
    const events = props?.prepareEvents
        ? props.prepareEvents(context.events)
        : context.events;
    const users = props?.prepareUsers
        ? props.prepareUsers(context.users)
        : context.users;
    return { ...context, events, users };
};

export const DataProvider = (props: {
    children: React.ReactNode;
    events: Event[];
    users: User[];
    activeUserName: string | undefined;
}) => {
    const [events, setEvents] = useState<Event[]>(props.events);
    const [users, setUsers] = useState<User[]>(props.users);
    const [activeUser, setActiveUserRaw] = useState<User | undefined>(
        props.activeUserName
            ? users.find((user) => user.name === props.activeUserName)
            : undefined,
    );

    const setActiveUser = (username: string | undefined) => {
        setActiveUserRaw(users.find((user) => user.name === username));
    };

    return (
        <DataContext.Provider
            value={{
                events,
                setEvents,
                users,
                setUsers,
                activeUser,
                setActiveUser,
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};
