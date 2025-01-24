import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function readCookie(name: string) {
    if (typeof document !== "undefined") {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(";").shift() ?? undefined;
        }
    }
    return undefined;
}

export function debounce<F extends (...args: never[]) => void>(
    func: F,
    waitFor: number,
) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    return (...args: Parameters<F>): void => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = undefined;
        }, waitFor);
    };
}
