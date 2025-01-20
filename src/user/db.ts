"use server";

import { db } from "~/server/db";
import { TopicsTable, UserTable } from "~/server/db/schema";
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
    await db
        .update(TopicsTable)
        .set({ speaker: newUserName })
        .where(eq(TopicsTable.speaker, oldUserName));
    await db
        .update(TopicsTable)
        .set({ suggestedBy: newUserName })
        .where(eq(TopicsTable.suggestedBy, oldUserName));
}
