import { z } from "zod";

export type Event = z.infer<typeof EventSchema>;
export const EventSchema = z.object({
    id: z.number().int(),
    description: z.string(),
    suggestedBy: z.number().int(),
    speaker: z.number().int(),
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

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    imageUrl: z.string().max(512).nullish(),
    createdAt: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
    }, z.date()),
});

export const DEFAULT_USER = {
    id: -1,
    name: "Anyone",
    createdAt: new Date(0),
    imageUrl: null,
};
