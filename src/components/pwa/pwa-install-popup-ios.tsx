"use client";

import { useLocalStorage } from "@/lib/use-local-storage";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface SafariNavigator extends Navigator {
    standalone?: boolean;
}

export function PwaInstallPopupIos() {
    const searchParams = useSearchParams();
    const isIos =
        typeof window !== "undefined" &&
        /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone =
        typeof window !== "undefined" &&
        (window.navigator as SafariNavigator).standalone === true;
    const [forcePwa, setForcePwa] = useState<boolean>(() => {
        return searchParams.get("force_pwa") === "true";
    });
    const { value: isDismissed, setValue: setIsDismissed } = useLocalStorage(
        "pwa-install-popup-dismissed",
        false,
    );

    const debug = false;

    return (
        <div
            data-show={
                debug || (isIos && !isStandalone && (!isDismissed || forcePwa))
            }
            className="bg-bg/70 fixed inset-0 z-50 hidden items-end backdrop-blur-sm data-[show=true]:flex"
        >
            <div className="border-border bg-surface mx-auto w-full max-w-lg translate-y-2 rounded-t-2xl border p-4 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-xl transition-transform data-[show=true]:translate-y-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                        <h2 className="text-lg font-semibold">
                            Install on iOS
                        </h2>
                        <p className="text-text-muted text-sm">
                            Add HirnStammtisch to your Home Screen.
                        </p>
                    </div>
                    <button
                        aria-label="Dismiss iOS install instructions"
                        className="border-border bg-surface-hover text-text hidden h-8 w-8 shrink-0 items-center justify-center rounded border md:inline-flex"
                        onClick={() => {
                            setIsDismissed(true);
                            setForcePwa(false);
                        }}
                    >
                        ×
                    </button>
                </div>
                <ol className="text-text-muted mt-3 list-decimal space-y-1 pl-5 text-sm">
                    <li>Open Share in Safari</li>
                    <li>Select Add to Home Screen</li>
                    <li>Confirm Add</li>
                </ol>
                <div className="mt-4 flex gap-3">
                    <button
                        className="border-border bg-surface-hover text-text rounded border px-4 py-2"
                        onClick={() => {
                            setIsDismissed(true);
                            setForcePwa(false);
                        }}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
