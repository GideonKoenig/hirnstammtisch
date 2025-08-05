"server-only";

import { auth } from "@/server/auth";
import { cookies } from "next/headers";
import { tryCatch } from "@/lib/try-catch";
import {
    type Event,
    type Preference,
    type ClientEvent,
    type ClientUser,
} from "@/lib/types";
import { createRedactedField } from "@/lib/permissions/redact-fields";
import { type User } from "@/lib/auth-client";
import { preference } from "@/server/db/schema";
import { db } from "@/server/db";
import { parseUserRole } from "@/lib/permissions/utilts";
import { PREFERENCES_DEFAULT } from "@/lib/permissions/preferences";

export async function readCookie(name: string) {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value ?? undefined;
}

export function getPathname(headers: Headers) {
    const xPathname = headers.get("x-pathname");
    if (xPathname) return xPathname;

    const referer = headers.get("referer");
    if (referer) return tryCatch(() => new URL(referer).pathname).unwrapOr("/");
    return "/";
}

export async function getSession(headers: Headers) {
    return await auth.api.getSession({
        headers: headers,
    });
}

export async function redactEvent<T extends Event | Event[]>(
    events: T,
    viewer: User | null | undefined,
): Promise<T extends Event[] ? ClientEvent[] : ClientEvent> {
    type ReturnType = T extends Event[] ? ClientEvent[] : ClientEvent;

    const viewerRole = parseUserRole(viewer?.role);

    // Fetch all preferences at once
    const result = await tryCatch(db.select().from(preference));
    const preferences = result.unwrapOr([]);

    const preferencesMap = new Map<string, Preference>();
    for (const pref of preferences) {
        preferencesMap.set(pref.userId, pref);
    }

    const redactSingleEvent = (event: Event) => {
        const eventPreferences =
            preferencesMap.get(event.speaker) ?? PREFERENCES_DEFAULT;

        return {
            ...event,
            slidesUrl: createRedactedField(
                event.slidesUrl,
                viewerRole,
                eventPreferences.slidesVisibility,
            ),
            recording: createRedactedField(
                event.recording,
                viewerRole,
                "members",
            ),
        };
    };

    if (Array.isArray(events)) {
        return events.map((event) => redactSingleEvent(event)) as ReturnType;
    }

    return redactSingleEvent(events) as ReturnType;
}

export async function redactUser<T extends User | User[]>(
    users: T,
    viewer: User | null | undefined,
): Promise<T extends User[] ? ClientUser[] : ClientUser> {
    type ReturnType = T extends User[] ? ClientUser[] : ClientUser;

    const viewerRole = parseUserRole(viewer?.role);

    // Fetch all preferences at once
    const result = await tryCatch(db.select().from(preference));
    const preferences = result.unwrapOr([]);

    const preferencesMap = new Map<string, Preference>();
    for (const pref of preferences) {
        preferencesMap.set(pref.userId, pref);
    }

    const redactSingleUser = (userData: User) => {
        const userPreferences =
            preferencesMap.get(userData.id) ?? PREFERENCES_DEFAULT;

        return {
            ...userData,
        };
    };

    if (Array.isArray(users)) {
        return users.map((userData) =>
            redactSingleUser(userData),
        ) as ReturnType;
    }

    return redactSingleUser(users) as ReturnType;
}
