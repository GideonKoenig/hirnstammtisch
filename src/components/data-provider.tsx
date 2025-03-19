"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type User, type Event } from "~/lib/data-types";
import {
    deleteCookie,
    deleteLocalStorage,
    readCookie,
    readLocalStorage,
    setCookie,
    setLocalStorage,
} from "~/lib/utils";

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
    const [activeUser, setActiveUserRaw] = useState<User | undefined>(() => {
        const username =
            props.activeUserName ??
            readCookie("username") ??
            readLocalStorage("username");
        return username
            ? props.users.find((user) => user.name === username)
            : undefined;
    });

    const setActiveUser = (username: string | undefined) => {
        if (username) {
            setActiveUserRaw(
                props.users.find((user) => user.name === username),
            );
            setCookie("username", username);
            setLocalStorage("username", username);
        } else {
            setActiveUserRaw(undefined);
            deleteCookie("username");
            deleteLocalStorage("username");
        }
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
