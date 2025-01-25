"use client";

import { createContext, useContext, useEffect, useState } from "react";

type StatusContextType = {
    isOffline: boolean;
};

const StatusContext = createContext<StatusContextType>({ isOffline: false });

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <StatusContext.Provider value={{ isOffline }}>
            {children}
        </StatusContext.Provider>
    );
};
