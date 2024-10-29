"use server";

import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "~/server/db";
import { TopicsTable } from "~/server/db/schema";

export async function addTopic(topic: InferInsertModel<typeof TopicsTable>) {
    await db.insert(TopicsTable).values({
        suggestedBy: topic.suggestedBy,
        speaker: topic.speaker,
        description: topic.description,
        deleted: topic.deleted,
    });
}

export async function deleteTopic(updatedTopic: { id: number }) {
    await db
        .update(TopicsTable)
        .set({
            deleted: true,
        })
        .where(eq(TopicsTable.id, updatedTopic.id));
}

export async function updateTopicSpeaker(updatedTopic: {
    id: number;
    speaker: string;
}) {
    await db
        .update(TopicsTable)
        .set({
            speaker: updatedTopic.speaker,
        })
        .where(eq(TopicsTable.id, updatedTopic.id));
}

export async function updateTopicDescription(updatedTopic: {
    id: number;
    description: string;
}) {
    await db
        .update(TopicsTable)
        .set({
            description: updatedTopic.description,
        })
        .where(eq(TopicsTable.id, updatedTopic.id));
}

export async function updateTopicEventDate(updatedTopic: {
    id: number;
    eventAt: Date | undefined;
}) {
    await db
        .update(TopicsTable)
        .set({
            eventAt: updatedTopic.eventAt ?? null,
        })
        .where(eq(TopicsTable.id, updatedTopic.id));
}

export async function updateTopicPresentationUrl(updatedTopic: {
    id: number;
    presentationUrl: string | null;
}) {
    await db
        .update(TopicsTable)
        .set({
            presentationUrl: updatedTopic.presentationUrl,
        })
        .where(eq(TopicsTable.id, updatedTopic.id));
}
