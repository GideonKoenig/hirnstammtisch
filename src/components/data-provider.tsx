"use client";

import { createContext, useContext, useState } from "react";
import { type User, type Event } from "~/lib/data-types";

type ContextType = {
    events: Event[];
    users: User[];
    activeUser: User | undefined;
    setActiveUser: (username: string | undefined) => void;
};

const DataContext = createContext<ContextType>({
    events: [],
    users: [],
    activeUser: undefined,
    setActiveUser: () => {
        console.log("DataProvider used outside of context");
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
    console.log("ran data provider");
    const [activeUser, setActiveUserRaw] = useState<User | undefined>(
        props.activeUserName
            ? props.users.find((user) => user.name === props.activeUserName)
            : undefined,
    );

    const setActiveUser = (username: string | undefined) => {
        setActiveUserRaw(props.users.find((user) => user.name === username));
    };

    return (
        <DataContext.Provider
            value={{
                events: props.events,
                users: props.users,
                activeUser,
                setActiveUser,
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};
