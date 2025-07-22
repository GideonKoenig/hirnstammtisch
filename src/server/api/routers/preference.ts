import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { preference } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { tryCatchAsync } from "@/lib/try-catch";
import { TRPCError } from "@trpc/server";
import { defaultPreferences } from "@/lib/permissions";

const visibilitySchema = z.enum(["everyone", "guests", "members"]);

export const preferenceRouter = createTRPCRouter({
    get: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            const existingPreferences = await tryCatchAsync(async () => {
                return await ctx.db
                    .select()
                    .from(preference)
                    .where(eq(preference.userId, input.userId))
                    .limit(1);
            }).unwrap({
                errorMessage: "Failed to fetch user preferences",
            });

            if (existingPreferences.length > 0) return existingPreferences[0]!;

            const newPreferences = await tryCatchAsync(async () => {
                await ctx.db.insert(preference).values({
                    userId: input.userId,
                    ...defaultPreferences,
                });
                return await ctx.db
                    .select()
                    .from(preference)
                    .where(eq(preference.userId, input.userId))
                    .limit(1);
            }).unwrap({
                expectation: "expectSingle",
                errorMessage: "Failed to create user preferences",
            });

            return newPreferences;
        }),

    update: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                slidesVisibility: visibilitySchema.optional(),
                recordingsVisibility: visibilitySchema.optional(),
                membershipVisibility: visibilitySchema.optional(),
                speakerStatusVisibility: visibilitySchema.optional(),
                attendanceVisibility: visibilitySchema.optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await tryCatchAsync(async () => {
                const { userId, ...updateData } = input;
                await ctx.db
                    .update(preference)
                    .set(updateData)
                    .where(eq(preference.userId, userId));
            }).unwrap({
                errorMessage: "Failed to update user preferences",
            });
        }),
});
