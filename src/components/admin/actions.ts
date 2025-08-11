"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/server/db";
import { event } from "@/server/db/schema";
import { getSession } from "@/server/utils";
import eventsJson from "@data/events.json";

function toBerlin19(dateString: string | null) {
    if (!dateString) return null;
    const source = new Date(dateString);
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Berlin",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(source);
    const year = Number(parts.find((p) => p.type === "year")?.value ?? "0");
    const month = Number(parts.find((p) => p.type === "month")?.value ?? "1");
    const day = Number(parts.find((p) => p.type === "day")?.value ?? "1");

    // Create a UTC date for the target local wall time (19:00) then adjust by
    // the Berlin offset at that instant. This yields a Date that represents
    // 19:00 in Europe/Berlin regardless of DST.
    const utcGuess = new Date(Date.UTC(year, month - 1, day, 19, 0, 0));
    const asBerlin = new Date(
        utcGuess.toLocaleString("en-US", { timeZone: "Europe/Berlin" }),
    );
    const asUtc = new Date(
        utcGuess.toLocaleString("en-US", { timeZone: "UTC" }),
    );
    const offsetMs = asBerlin.getTime() - asUtc.getTime();
    return new Date(utcGuess.getTime() - offsetMs);
}

export async function migrateLegacyEvents(params: {
    oldUserId: number;
    targetUserId: string;
}) {
    const session = await getSession(await headers());
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const now = new Date();
    const legacy = (
        eventsJson as Array<{
            description: string;
            speaker: number;
            deleted: boolean;
            event_at: string | null;
            created_at: string | null;
            presentation_url: string | null;
        }>
    ).filter((e) => e.speaker === params.oldUserId);

    const titles = legacy.map((e) => e.description);
    const existing = await db
        .select({ title: event.title })
        .from(event)
        .where(
            and(
                eq(event.speaker, params.targetUserId),
                inArray(event.title, titles),
            ),
        );
    const existingTitles = new Set(existing.map((e) => e.title));

    const uniqueToInsert = legacy
        .filter((e) => !existingTitles.has(e.description))
        .map((e) => ({
            title: e.description,
            speaker: params.targetUserId,
            slidesUrl:
                e.presentation_url && e.presentation_url.length > 0
                    ? e.presentation_url
                    : null,
            date: toBerlin19(e.event_at),
            deleted: e.deleted,
            createdAt: e.created_at ? new Date(e.created_at) : now,
            updatedAt: now,
        }));

    if (uniqueToInsert.length > 0) {
        await db.insert(event).values(uniqueToInsert);
        revalidatePath("/admin");
    }

    return { inserted: uniqueToInsert.length };
}

export async function loadLegacyEvents(params: { oldUserId: number }) {
    const session = await getSession(await headers());
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const legacy = (
        eventsJson as Array<{
            description: string;
            speaker: number;
            deleted: boolean;
            event_at: string | null;
            created_at: string | null;
            presentation_url: string | null;
        }>
    )
        .filter((e) => e.speaker === params.oldUserId)
        .map((e) => ({
            title: e.description,
            date: toBerlin19(e.event_at),
            deleted: e.deleted,
        }));

    return legacy;
}

export async function getMigrationStatus(params: {
    oldUserId: number;
    targetUserId: string;
}) {
    const session = await getSession(await headers());
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    const legacyTitles = (
        eventsJson as Array<{ description: string; speaker: number }>
    )
        .filter((e) => e.speaker === params.oldUserId)
        .map((e) => e.description);

    const totalOld = legacyTitles.length;
    if (totalOld === 0) return { totalOld: 0, migrated: 0, missing: 0 };

    const existing = await db
        .select({ title: event.title })
        .from(event)
        .where(
            and(
                eq(event.speaker, params.targetUserId),
                inArray(event.title, legacyTitles),
            ),
        );
    const migrated = existing.length;
    const missing = Math.max(totalOld - migrated, 0);
    return { totalOld, migrated, missing };
}

export async function actionMigrate(formData: FormData) {
    const oldUserId = Number(formData.get("oldUserId") ?? 0);
    const rawTarget = formData.get("targetUserId");
    const targetUserId = typeof rawTarget === "string" ? rawTarget : "";
    const res = await migrateLegacyEvents({ oldUserId, targetUserId });
    return { ok: true, inserted: res.inserted } as const;
}

export async function actionLoadLegacy(formData: FormData) {
    const oldUserId = Number(formData.get("oldUserId") ?? 0);
    const events = await loadLegacyEvents({ oldUserId });
    return events.map((e) => ({
        title: e.title,
        deleted: e.deleted,
        date: e.date ? new Date(e.date).toISOString() : null,
    }));
}

export async function actionStatus(formData: FormData) {
    const oldUserId = Number(formData.get("oldUserId") ?? 0);
    const rawTarget = formData.get("targetUserId");
    const targetUserId = typeof rawTarget === "string" ? rawTarget : "";
    const res = await getMigrationStatus({ oldUserId, targetUserId });
    return res;
}
