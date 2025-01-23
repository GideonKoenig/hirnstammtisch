"use server";

import { db } from "~/server/db";
import { EventsTable, UserTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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

export async function updateUser(oldUserName: string, newUserName: string) {
    if (newUserName === "") return;
    await db
        .update(UserTable)
        .set({ name: newUserName })
        .where(eq(UserTable.name, oldUserName));
}
