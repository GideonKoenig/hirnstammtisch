"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ClientEvent, type ClientUser } from "@/lib/types";
import { authClient, User } from "@/lib/auth-client";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getSpeaker(event: ClientEvent, users: ClientUser[]) {
    return users.find((u) => u.id === event.speaker);
}

export function useUser() {
    return authClient.useSession().data?.user as User | null;
}
