"use client";

import { usePwa } from "@/components/pwa/pwa-provider";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function PwaInstallPopup() {
    const searchParams = useSearchParams();
    const { isInstallable, installPrompt } = usePwa();
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
            data-show={debug || (isInstallable && (!isDismissed || forcePwa))}
            className="bg-bg/70 fixed inset-0 z-50 hidden items-end backdrop-blur-sm data-[show=true]:flex"
        >
            <div
                data-show={isInstallable && (!isDismissed || forcePwa)}
                className="border-border bg-surface mx-auto w-full max-w-lg translate-y-2 rounded-t-2xl border p-4 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-xl transition-transform data-[show=true]:translate-y-0"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                        <h2 className="text-lg font-semibold">
                            Install HirnStammtisch
                        </h2>
                        <p className="text-text-muted text-sm">
                            Add the app to your device for faster access and
                            offline support.
                        </p>
                    </div>
                    <button
                        aria-label="Dismiss install prompt"
                        className="border-border bg-surface-hover text-text hidden h-8 w-8 shrink-0 items-center justify-center rounded border md:inline-flex"
                        onClick={() => {
                            setIsDismissed(true);
                            setForcePwa(false);
                        }}
                    >
                        ×
                    </button>
                </div>
                <ul className="text-text-muted mt-3 list-disc space-y-1 pl-5 text-sm">
                    <li>One-tap launch from home screen</li>
                    <li>Improved performance and reliability</li>
                </ul>
                <div className="mt-4 flex gap-3">
                    <button
                        className="bg-accent text-text rounded px-4 py-2"
                        onClick={async () => {
                            await installPrompt();
                        }}
                    >
                        Install
                    </button>
                    <button
                        className="border-border bg-surface-hover text-text rounded border px-4 py-2"
                        onClick={() => {
                            setIsDismissed(true);
                            setForcePwa(false);
                        }}
                    >
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
}
