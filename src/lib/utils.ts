import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function setCookie(name: string, value: string) {
    if (typeof document !== "undefined") {
        document.cookie = `${name}=${value}; max-age=31536000; path=/; SameSite=Strict`;
    }
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

export function setLocalStorage(name: string, value: string) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(name, value);
    }
}

export function deleteLocalStorage(name: string) {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(name);
    }
}

export function readLocalStorage(name: string) {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem(name);
    }
    return undefined;
}

export function deleteCookie(name: string) {
    if (typeof document !== "undefined") {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
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
