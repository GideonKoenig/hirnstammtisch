import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { preference } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { tryCatch } from "@/lib/try-catch";
import { PREFERENCES_DEFAULT } from "@/lib/permissions/preferences";
import { VisibilityOptionsZod } from "@/lib/permissions/types";

export const preferenceRouter = createTRPCRouter({
    get: protectedProcedure("guest").query(async ({ ctx }) => {
        const result = await tryCatch(
            ctx.db
                .select({
                    userId: preference.userId,
                    slidesVisibility: preference.slidesVisibility,
                })
                .from(preference)
                .where(eq(preference.userId, ctx.session.user.id))
                .limit(1),
        );
        const preferences = result.unwrap();
        if (preferences.length > 1) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Found multiple preferences for user",
            });
        }
        if (preferences.length === 1) return preferences[0]!;
        return { userId: ctx.session.user.id, ...PREFERENCES_DEFAULT };
    }),

    update: protectedProcedure("guest")
        .input(
            z.object({
                slidesVisibility: VisibilityOptionsZod,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updated = await tryCatch(
                ctx.db
                    .update(preference)
                    .set(input)
                    .where(eq(preference.userId, ctx.session.user.id))
                    .returning({ userId: preference.userId }),
            );
            if (!updated.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update user preferences",
                });
            }
            const updatedRows = updated.unwrap();
            if (updatedRows.length === 1) return;

            const inserted = await tryCatch(
                ctx.db
                    .insert(preference)
                    .values({ userId: ctx.session.user.id, ...input })
                    .returning({ userId: preference.userId }),
            );
            if (!inserted.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create user preferences",
                });
            }
            const insertedRows = inserted.unwrap();
            if (insertedRows.length !== 1) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Invalid preference insert result",
                });
            }
            return;
        }),
});
