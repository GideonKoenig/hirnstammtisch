import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";
import { event } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { tryCatchAsync } from "@/lib/try-catch";
import { TRPCError } from "@trpc/server";
import { redactEvent } from "@/server/utils";
import { getUserRole, isSpeakerOrAdmin } from "@/lib/permissions";

export const eventRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const events = await tryCatchAsync(async () => {
            return await ctx.db
                .select()
                .from(event)
                .where(eq(event.deleted, false));
        }).unwrap({ errorMessage: "Failed to fetch events" });

        const redactedEvents = await redactEvent(events, ctx.session?.user);

        return redactedEvents;
    }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                suggestedBy: z.string(),
                speaker: z.string(),
                slidesUrl: z.string().nullish(),
                maxAttendees: z.number().int().positive().nullish(),
                date: z.date().nullish(),
                speakerNotes: z.string().nullish(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await tryCatchAsync(async () => {
                await ctx.db.insert(event).values(input);
            }).unwrap({ errorMessage: "Failed to create event" });
            return;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).optional(),
                suggestedBy: z.string().optional(),
                speaker: z.string().optional(),
                recording: z.string().nullable().optional(),
                slidesUrl: z.string().nullable().optional(),
                maxAttendees: z.number().int().positive().nullable().optional(),
                date: z.date().nullable().optional(),
                speakerNotes: z.string().nullable().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await tryCatchAsync(async () => {
                const { id, ...updateData } = input;
                await ctx.db
                    .update(event)
                    .set({ ...updateData, updatedAt: new Date() })
                    .where(eq(event.id, id));
            }).unwrap({ errorMessage: "Failed to update event" });
            return;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await tryCatchAsync(async () => {
                await ctx.db
                    .update(event)
                    .set({ deleted: true, updatedAt: new Date() })
                    .where(eq(event.id, input.id));
            }).unwrap({ errorMessage: "Failed to delete event" });
            return;
        }),
});
