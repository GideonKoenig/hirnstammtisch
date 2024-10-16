"use server";

import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function addUser(userName: string) {
    const existingUser = await db.select().from(user).where(eq(user.name, userName)).limit(1);

    if (existingUser.length < 1)
        await db.insert(user).values({
            name: userName,
        });
}

export async function updateUser(oldUserName: string, newUserName: string) {
    if (newUserName === "") return;
    await db.update(user).set({ name: newUserName }).where(eq(user.name, oldUserName));
}
