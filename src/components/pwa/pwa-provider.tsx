"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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

interface InstallPromptCallback {
    onSuccess?: () => void;
    onDismiss?: () => void;
}

type PwaContextType = {
    isOffline: boolean;
    deferredPrompt: InstallPromptEvent | null;
    isInstallable: boolean;
    installPrompt: (callback?: InstallPromptCallback) => Promise<void>;
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
                const isMobile =
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent,
                    );
                if (isMobile) {
                    setDeferredPrompt(event);
                    setIsInstallable(true);
                } else {
                    setIsInstallable(false);
                }
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

        if ("serviceWorker" in navigator) {
            let toastTimer: number | null = null;

            const scheduleToast = () => {
                if (toastTimer !== null) return;
                toastTimer = window.setTimeout(() => {
                    toast("Updating…");
                }, 1000);
            };

            const clearToastAndReload = () => {
                if (toastTimer !== null) {
                    clearTimeout(toastTimer);
                    toastTimer = null;
                }
                toast.dismiss();
                window.location.reload();
            };

            void navigator.serviceWorker
                .getRegistration()
                .then((r) => {
                    if (!r) return;
                    r.addEventListener("updatefound", scheduleToast, {
                        signal,
                    });
                    return r.update();
                })
                .catch(() => undefined);

            document.addEventListener(
                "visibilitychange",
                () => {
                    if (document.visibilityState === "visible") {
                        void navigator.serviceWorker
                            .getRegistration()
                            .then((r) => r?.update())
                            .catch(() => undefined);
                    }
                },
                { signal },
            );

            navigator.serviceWorker.addEventListener(
                "controllerchange",
                clearToastAndReload,
                { signal },
            );
        }

        return () => {
            controller.abort();
        };
    }, []);

    const installPrompt = async (callback?: InstallPromptCallback) => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const outcome = await deferredPrompt.userChoice;
        if (outcome.outcome === "accepted") {
            setDeferredPrompt(null);
            setIsInstallable(false);
            callback?.onSuccess?.();
        } else {
            callback?.onDismiss?.();
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
