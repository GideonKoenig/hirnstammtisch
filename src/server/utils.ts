"server-only";

import { auth } from "@/server/auth";
import { cookies } from "next/headers";
import { tryCatch } from "@/lib/try-catch";
import {
    type Event,
    type Preference,
    type ClientEvent,
    type ClientUser,
    type DbUser,
    type ClientAsset,
    type Asset,
} from "@/lib/types";
import { createRedactedField } from "@/lib/permissions/redact-fields";
import { type User } from "@/lib/auth-client";
import {
    preference,
    event as eventTable,
    eventAttachment,
} from "@/server/db/schema";
import { type db } from "@/server/db";
import { parseUserRole } from "@/lib/permissions/utilts";
import { PREFERENCES_DEFAULT } from "@/lib/permissions/preferences";
import { eq } from "drizzle-orm";

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
    ctx: typeof db,
): Promise<T extends Event[] ? ClientEvent[] : ClientEvent> {
    type ReturnType = T extends Event[] ? ClientEvent[] : ClientEvent;

    // Fetch all preferences at once from context db
    const result = await tryCatch(ctx.select().from(preference));
    const preferences = result.unwrapOr([]);

    const preferencesMap = new Map<string, Preference>();
    for (const pref of preferences) {
        preferencesMap.set(pref.userId, pref);
    }

    const redactSingleEvent = (event: Event) => {
        return event;
    };

    if (Array.isArray(events)) {
        return events.map((event) => redactSingleEvent(event)) as ReturnType;
    }

    return redactSingleEvent(events) as ReturnType;
}

export async function redactUser<T extends DbUser | DbUser[]>(
    users: T,
    _viewer: User | null | undefined,
    _ctx: typeof db,
): Promise<T extends DbUser[] ? ClientUser[] : ClientUser> {
    type ReturnType = T extends DbUser[] ? ClientUser[] : ClientUser;

    const redactSingleUser = (userData: DbUser): ClientUser => {
        return {
            id: userData.id,
            name: userData.name,
            role: parseUserRole(userData.role),
            createdAt: userData.createdAt,
        };
    };

    if (Array.isArray(users)) {
        return users.map((userData) =>
            redactSingleUser(userData),
        ) as ReturnType;
    }

    return redactSingleUser(users) as ReturnType;
}

export async function redactAssets<T extends Asset | Asset[]>(
    assets: T,
    viewer: User | null | undefined,
    ctx: typeof db,
): Promise<T extends Array<unknown> ? ClientAsset[] : ClientAsset> {
    type ReturnType = T extends Array<unknown> ? ClientAsset[] : ClientAsset;

    const viewerRole = parseUserRole(viewer?.role);
    const assetsArray: Asset[] = Array.isArray(assets) ? assets : [assets];

    // Fetch all preferences at once from context db
    const resultPref = await tryCatch(ctx.select().from(preference));
    const preferences = resultPref.unwrapOr([]);
    const preferencesMap = new Map<string, Preference>();
    for (const pref of preferences) preferencesMap.set(pref.userId, pref);

    // Fetch all speakers for assets at once from context db
    const resultEvents = await tryCatch(
        ctx
            .select({
                eventId: eventTable.id,
                speakerId: eventTable.speaker,
                assetId: eventAttachment.assetId,
            })
            .from(eventTable)
            .innerJoin(
                eventAttachment,
                eq(eventTable.id, eventAttachment.eventId),
            ),
    );
    const events = resultEvents.unwrapOr([]);
    const speakersMap = new Map<string, string>();
    for (const asset of assetsArray) {
        const event = events.find((e) => e.assetId === asset.id)!;
        speakersMap.set(asset.id, event.speakerId);
    }

    const redactOne = (row: Asset) => {
        const eventPreferences =
            preferencesMap.get(speakersMap.get(row.id)!) ?? PREFERENCES_DEFAULT;
        return {
            id: row.id,
            type: row.type,
            name: row.name,
            uploadthingId: createRedactedField(
                row.uploadthingId,
                viewerRole,
                eventPreferences.slidesVisibility,
            ),
            url: createRedactedField(
                row.url,
                viewerRole,
                eventPreferences.slidesVisibility,
            ),
            uploadedBy: row.uploadedBy,
            createdAt: row.createdAt,
        };
    };

    if (Array.isArray(assets))
        return assets.map((a) => redactOne(a)) as ReturnType;
    return redactOne(assets) as ReturnType;
}
