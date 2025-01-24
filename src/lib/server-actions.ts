"use server";

import { db } from "~/server/db";
import { EventsTable, UserTable } from "~/server/db/schema";
import { type User, type Event } from "~/lib/data-types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function addEvent(event: Omit<Event, "id" | "createdAt">) {
    await db.insert(EventsTable).values(event);
    revalidatePath("/events");
}

export async function updateEvent(eventId: number, newValue: Event) {
    await db
        .update(EventsTable)
        .set({
            ...newValue,
        })
        .where(eq(EventsTable.id, eventId));

    revalidatePath("/events");
}

export async function deleteEvent(eventId: number) {
    await db
        .update(EventsTable)
        .set({
            deleted: true,
        })
        .where(eq(EventsTable.id, eventId));
    revalidatePath("/events");
}

export async function addUser(userName: string) {
    const existingUser = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.name, userName.trim()))
        .limit(1);

    if (existingUser.length < 1)
        await db.insert(UserTable).values({
            name: userName.trim(),
        });
}

export async function updateUser(userId: number, newValue: User) {
    await db
        .update(UserTable)
        .set({ ...newValue })
        .where(eq(UserTable.id, userId));

    revalidatePath("/profile");
}

export async function removeProfileImage(user: User) {
    if (!user.imageUrl) return;

    const fileKey = user.imageUrl.split("/").pop();
    if (!fileKey) throw new Error(`Invalid file URL: ${user.imageUrl}`);
    const success = await utapi.deleteFiles(fileKey);
    if (!success.success) return;

    await updateUser(user.id, { ...user, imageUrl: null });
    revalidatePath("/profile");
}
