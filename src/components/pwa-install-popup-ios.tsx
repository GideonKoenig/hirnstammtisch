"use client";

import { useLocalStorage } from "~/lib/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function PwaInstallPopupIos() {
    const searchParams = useSearchParams();
    const isIos =
        typeof window !== "undefined" &&
        /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const [forcePwa, setForcePwa] = useState<boolean>(() => {
        return searchParams.get("force_pwa") === "true";
    });
    const [isDismissed, setIsDismissed] = useLocalStorage(
        "pwa-install-popup-dismissed",
        false,
    );

    return (
        <div
            data-show={isIos && (!isDismissed || forcePwa)}
            className="bg-menu-dark/90 shadow-menu-dark absolute top-0 left-0 z-20 hidden h-dvh w-dvw flex-col items-center p-8 pt-16 shadow-md data-[show=true]:flex"
        >
            <div className="bg-menu-main flex w-full max-w-md flex-col items-center gap-4 rounded-lg p-6 shadow-md">
                <h2 className="text-center text-xl font-bold">
                    Install HirnstammTisch on iOS
                </h2>
                <p className="text-center text-sm">
                    To install the HirnstammTisch app on your iOS device:
                </p>
                <ol className="list-decimal space-y-2 pl-6 text-sm">
                    <li>
                        Tap the Share button in Safari&apos;s toolbar (the
                        square with an arrow pointing up)
                    </li>
                    <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                    <li>Tap &quot;Add&quot; in the top right corner</li>
                </ol>
                <p className="text-text-muted text-center text-xs">
                    Once installed, you&apos;ll have quick access to
                    HirnstammTisch right from your home screen.
                </p>
                <div className="flex justify-center pt-4">
                    <button
                        className="bg-menu-light text-text-normal hover:bg-menu-light/80 rounded px-8 py-1.5 transition-colors"
                        onClick={() => {
                            setIsDismissed(true);
                            setForcePwa(false);
                        }}
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
}
