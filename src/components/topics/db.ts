"use server";

import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "~/server/db";
import { topics } from "~/server/db/schema";

export async function addTopic(topic: InferInsertModel<typeof topics>) {
    await db.insert(topics).values({
        from: topic.from,
        for: topic.for,
        description: topic.description,
    });
}

export async function deleteTopic(updatedTopic: { id: number }) {
    await db
        .update(topics)
        .set({
            status: "deleted",
        })
        .where(eq(topics.id, updatedTopic.id));
}

export async function markUsedTopic(updatedTopic: { id: number }) {
    await db
        .update(topics)
        .set({
            status: "used",
            usedAt: new Date(),
        })
        .where(eq(topics.id, updatedTopic.id));
}
