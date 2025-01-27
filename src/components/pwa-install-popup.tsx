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
                    Install HirnstammTisch App
                </h2>
                <p className="text-center text-sm">
                    Get the best experience by installing HirnstammTisch as an
                    app:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>Quick access from your home screen</li>
                    <li>Works offline or with poor connection</li>
                    <li>Smoother experience and faster loading</li>
                </ul>
                <p className="text-text-muted text-center text-xs">
                    You can also install the app later from your profile page.
                </p>
                <div className="flex gap-4 pt-4">
                    <button
                        className="bg-accent hover:bg-accent/80 text-text-normal rounded px-8 py-1.5 transition-colors"
                        onClick={async () => {
                            await installPrompt();
                        }}
                    >
                        Install Now
                    </button>
                    <button
                        className="bg-menu-light text-text-normal hover:bg-menu-light/80 rounded px-8 py-1.5 transition-colors"
                        onClick={() => {
                            setIsDismissed(true);
                            setForcePwa(false);
                        }}
                    >
                        Not Now
                    </button>
                </div>
            </div>
        </div>
    );
}
