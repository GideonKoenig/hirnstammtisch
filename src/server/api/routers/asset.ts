import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { asset, event, preference, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { tryCatchAsync } from "@/lib/try-catch";
import { TRPCError } from "@trpc/server";
import {
    hasPermission,
    getUserRole,
    defaultPreferences,
} from "@/lib/permissions";

export const assetRouter = createTRPCRouter({
    get: publicProcedure
        .input(
            z.object({
                id: z.string(),
                context: z.object({
                    type: z.enum(["recording"]),
                    eventId: z.string(),
                }),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (input.context.type === "recording") {
                const contextData = await tryCatchAsync(
                    async () =>
                        await ctx.db
                            .select({
                                recordingsVisibility:
                                    preference.recordingsVisibility,
                            })
                            .from(event)
                            .leftJoin(
                                preference,
                                eq(preference.userId, event.speaker),
                            )
                            .where(eq(event.id, input.context.eventId))
                            .limit(1),
                ).unwrap({
                    expectation: "expectSingle",
                    notFoundMessage: "Event not found",
                    errorMessage: "Failed to fetch event recording permissions",
                });

                const userRole = getUserRole(ctx.session?.user?.role);
                const visibilityLevel =
                    contextData.recordingsVisibility ??
                    defaultPreferences.recordingsVisibility;
                const hasAccess = hasPermission(userRole, visibilityLevel);

                if (!hasAccess)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message:
                            "You do not have permission to access this recording",
                    });
            }

            const assetData = await tryCatchAsync(
                async () =>
                    await ctx.db
                        .select()
                        .from(asset)
                        .where(eq(asset.id, input.id))
                        .limit(1),
            ).unwrap({
                expectation: "expectSingle",
                notFoundMessage: "Asset not found",
                errorMessage: "Failed to fetch asset",
            });

            return assetData;
        }),

    delete: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                context: z.union([
                    z.object({
                        type: z.literal("recording"),
                    }),
                    z.object({
                        type: z.literal("profile-image"),
                    }),
                ]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const context = input.context;
            if (context.type === "recording") {
                const userRole = getUserRole(ctx.session?.user?.role);
                const hasAccess = hasPermission(userRole, "members");

                if (!hasAccess)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You must be a member to delete recordings",
                    });
            } else if (input.context.type === "profile-image") {
                const userData = await tryCatchAsync(
                    async () =>
                        await ctx.db
                            .select({ imageId: user.imageId })
                            .from(user)
                            .where(eq(user.id, ctx.session.user.id))
                            .limit(1),
                ).unwrap({
                    expectation: "expectSingle",
                    notFoundMessage: "User not found",
                    errorMessage: "Failed to verify profile image ownership",
                });

                if (userData.imageId !== input.id)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You can only delete your own profile images",
                    });
            }

            const assetElement = await tryCatchAsync(
                async () =>
                    await ctx.db
                        .select()
                        .from(asset)
                        .where(eq(asset.id, input.id))
                        .limit(1),
            ).unwrap({
                expectation: "expectSingle",
                notFoundMessage: "Asset not found",
                errorMessage: "Failed to fetch asset for deletion",
            });

            await tryCatchAsync(async () => {
                const utapi = new UTApi();
                const utDelete = await utapi.deleteFiles(
                    assetElement.uploadthingId,
                );
                if (!utDelete.success)
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Uploadthing failed to delete asset",
                    });

                await ctx.db.delete(asset).where(eq(asset.id, input.id));
            }).unwrap({ errorMessage: "Failed to delete asset" });
            return;
        }),
});
