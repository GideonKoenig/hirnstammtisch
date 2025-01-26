"use client";

import { usePwa } from "~/components/pwa-provider";
import { useLocalStorage } from "~/lib/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function PwaInstallPopup() {
    const searchParams = useSearchParams();
    const { isInstallable, installPrompt } = usePwa();
    const [forcePwa, setForcePwa] = useState<boolean>(() => {
        return searchParams.get("force_pwa") === "true";
    });
    const [isDismissed, setIsDismissed] = useLocalStorage(
        "pwa-install-popup-dismissed",
        false,
    );

    return (
        <div
            data-show={isInstallable && (!isDismissed || forcePwa)}
            className="bg-menu-dark/90 shadow-menu-dark absolute top-0 left-0 z-20 hidden h-dvh w-dvw flex-col items-center p-8 pt-16 shadow-md data-[show=true]:flex"
        >
            <div className="bg-menu-main flex w-full max-w-md flex-col items-center gap-4 rounded-lg p-6 shadow-md">
                <h2 className="text-center text-xl font-bold">
                    Install the HirnstammTisch App
                </h2>
                <p className="text-center text-sm">
                    Installing the HirnstammTisch app on your device makes it
                    easier and more convenient to stay up to date.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        className="bg-accent hover:bg-accent/80 text-text-normal rounded px-8 py-1.5 transition-colors"
                        onClick={async () => {
                            await installPrompt();
                        }}
                    >
                        Install
                    </button>
                    <button
                        className="bg-menu-light text-text-normal hover:bg-menu-light/80 rounded px-8 py-1.5 transition-colors"
                        onClick={() => {
                            setIsDismissed(true);
                            setForcePwa(false);
                        }}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
