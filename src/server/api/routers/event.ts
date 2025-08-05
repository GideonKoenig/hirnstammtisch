import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";
import { event } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { redactEvent } from "@/server/utils";
import { tryCatch } from "@/lib/try-catch";

export const eventRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const result = await tryCatch(
            ctx.db.select().from(event).where(eq(event.deleted, false)),
        );
        const events = result.unwrap();
        const redactedEvents = await redactEvent(events, ctx.session?.user);
        return redactedEvents;
    }),

    create: protectedProcedure("member")
        .input(
            z.object({
                title: z.string().min(1),
                speaker: z.string(),
                slidesUrl: z.string().nullish(),
                maxAttendees: z.number().int().positive().nullish(),
                date: z.date().nullish(),
                speakerNotes: z.string().nullish(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await tryCatch(ctx.db.insert(event).values(input));
            if (!result.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create event",
                });
            }
            return;
        }),

    update: protectedProcedure("member")
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).optional(),
                speaker: z.string().optional(),
                recording: z.string().nullable().optional(),
                slidesUrl: z.string().nullable().optional(),
                maxAttendees: z.number().int().positive().nullable().optional(),
                date: z.date().nullable().optional(),
                speakerNotes: z.string().nullable().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .update(event)
                    .set({ ...input, updatedAt: new Date() })
                    .where(eq(event.id, input.id)),
            );
            if (!result.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update event",
                });
            }
            return;
        }),

    delete: protectedProcedure("member")
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .update(event)
                    .set({ deleted: true, updatedAt: new Date() })
                    .where(eq(event.id, input.id)),
            );
            if (!result.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete event",
                });
            }
            return;
        }),
});
