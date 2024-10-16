import { z } from "zod";

export const TopicSchema = z.object({
    id: z.number().int(),
    description: z.string(),
    from: z.string().max(256),
    for: z.string().max(256).optional(),
    status: z.enum(["used", "open", "deleted"]),
    createdAt: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
    }, z.date()),
});
