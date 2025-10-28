"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from "react";
import { type ClientEvent, type Event } from "@/lib/types";
import { EventModal } from "@/components/events/event-modal";

interface EventsContextType {
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    activeEvent: Partial<Event>;
    setActiveEvent: Dispatch<SetStateAction<Partial<Event>>>;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    pastEvents: boolean;
    setPastEvents: Dispatch<SetStateAction<boolean>>;
}

const EventContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
    const context = useContext(EventContext);

    if (!context) {
        throw new Error(
            "useEvents must be used within an EventContextProvider",
        );
    }

    const {
        modalOpen,
        setModalOpen,
        activeEvent,
        setActiveEvent,
        search,
        setSearch,
        pastEvents,
        setPastEvents,
    } = context;

    const openModal = (event?: ClientEvent) => {
        setActiveEvent(event ?? {});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setActiveEvent({});
    };

    return {
        modalOpen,
        activeEvent,
        setActiveEvent,
        search,
        pastEvents,
        openModal,
        closeModal,
        setSearch,
        setPastEvents,
    };
};

export function EventContextProvider({ children }: { children: ReactNode }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeEvent, setActiveEvent] = useState<Partial<Event>>({});
    const [search, setSearch] = useState("");
    const [pastEvents, setPastEvents] = useState(false);

    return (
        <EventContext.Provider
            value={{
                modalOpen,
                setModalOpen,
                activeEvent,
                setActiveEvent,
                search,
                setSearch,
                pastEvents,
                setPastEvents,
            }}
        >
            {children}
            <EventModal />
        </EventContext.Provider>
    );
}
