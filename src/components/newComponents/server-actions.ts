"use server";

import { db } from "~/server/db";
import { EventsTable } from "~/server/db/schema";
import { type Event } from "~/components/newComponents/data-types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateEvent(eventId: number, newValue: Event) {
    await db
        .update(EventsTable)
        .set({
            ...newValue,
        })
        .where(eq(EventsTable.id, eventId));

    revalidatePath("/events");
}
