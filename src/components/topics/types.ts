import { z } from "zod";

export type Topic = z.infer<typeof TopicSchema>;

export const TopicSchema = z.object({
    id: z.number().int(),
    description: z.string(),
    suggestedBy: z.string().max(256),
    speaker: z.string().max(256),
    presentationUrl: z.string().max(512).nullish(),
    deleted: z.boolean(),
    eventAt: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
    }, z.date().nullish()),
    createdAt: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
    }, z.date()),
});
