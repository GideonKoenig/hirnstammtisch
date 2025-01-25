"use client";

import { createContext, useContext, useEffect, useState } from "react";

declare global {
    interface WindowEventMap {
        beforeinstallprompt: InstallPromptEvent;
    }
}

interface InstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

type PwaContextType = {
    isOffline: boolean;
    deferredPrompt: InstallPromptEvent | null;
    isInstallable: boolean;
    installPrompt: () => Promise<void>;
};

const PwaContext = createContext<PwaContextType>({
    isOffline: false,
    deferredPrompt: null,
    isInstallable: false,
    installPrompt: async () => {
        console.warn("Install prompt called outside of PWA provider context");
    },
});

export const usePwa = () => useContext(PwaContext);

export const PwaProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOffline, setIsOffline] = useState(false);
    const [isInstallable, setIsInstallable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] =
        useState<InstallPromptEvent | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        window.addEventListener("online", () => setIsOffline(false), {
            signal,
        });
        window.addEventListener("offline", () => setIsOffline(true), {
            signal,
        });
        window.addEventListener(
            "beforeinstallprompt",
            (event) => {
                event.preventDefault();
                setDeferredPrompt(event);
                setIsInstallable(true);
            },
            {
                signal,
            },
        );
        window.addEventListener(
            "appinstalled",
            () => {
                setDeferredPrompt(null);
                setIsInstallable(false);
            },
            { signal },
        );

        return () => {
            controller.abort();
        };
    }, []);

    const installPrompt = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const outcome = await deferredPrompt.userChoice;
        if (outcome.outcome === "accepted") {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return (
        <PwaContext.Provider
            value={{
                isOffline,
                deferredPrompt,
                isInstallable,
                installPrompt,
            }}
        >
            {children}
        </PwaContext.Provider>
    );
};
