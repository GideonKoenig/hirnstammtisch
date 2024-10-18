import { z } from "zod";

export type Topic = z.infer<typeof TopicSchema>;

export const TopicSchema = z.object({
    id: z.number().int(),
    description: z.string(),
    suggestedBy: z.string().max(256),
    speaker: z.string().max(256),
    status: z.enum(["used", "open", "deleted"]),
    eventAt: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
    }, z.date().optional()),
    createdAt: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
    }, z.date()),
});
