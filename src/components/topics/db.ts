"use server";

import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "~/server/db";
import { topics } from "~/server/db/schema";

export async function addTopic(topic: InferInsertModel<typeof topics>) {
    await db.insert(topics).values({
        from: topic.from,
        for: topic.for,
        description: topic.description,
    });
}

export async function updateTopic(updatedTopic: {
    id: number;
    status: "open" | "used" | "deleted";
}) {
    await db
        .update(topics)
        .set({
            status: updatedTopic.status,
        })
        .where(eq(topics.id, updatedTopic.id!));
}

export async function deleteTopic(id: number) {
    await db.delete(topics).where(eq(topics.id, id));
}
