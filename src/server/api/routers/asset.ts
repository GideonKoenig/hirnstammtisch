import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { asset, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { TRPCError } from "@trpc/server";
import { tryCatch } from "@/lib/try-catch";
import { parseUserRole, checkVisibility } from "@/lib/permissions/utilts";

export const assetRouter = createTRPCRouter({
    getRecording: protectedProcedure("member")
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .select({ assetData: asset })
                    .from(asset)
                    .where(eq(asset.id, input.id))
                    .limit(1),
            );
            const data = result.unwrap();
            if (data.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message:
                        data.length === 0
                            ? "Asset not found"
                            : "Found assets with overlapping ids",
                });
            }
            const { assetData } = data[0]!;
            return assetData;
        }),

    delete: protectedProcedure("guest")
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .select({ assetData: asset })
                    .from(asset)
                    .where(eq(asset.id, input.id))
                    .limit(1),
            );
            const data = result.unwrap();
            if (data.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message:
                        data.length === 0
                            ? "Asset not found"
                            : "Found assets with overlapping ids",
                });
            }
            const { assetData } = data[0]!;

            if (assetData.type === "recording") {
                const userRole = parseUserRole(ctx.session?.user?.role);
                const hasAccess = checkVisibility(userRole, "members");
                if (!hasAccess)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You must be a member to delete recordings",
                    });
            } else if (assetData.type === "profile-image") {
                const userData = await tryCatch(
                    ctx.db
                        .select({ imageId: user.imageId })
                        .from(user)
                        .where(eq(user.id, ctx.session.user.id))
                        .limit(1),
                );
                const data = userData.unwrap();
                if (data.length !== 1) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message:
                            data.length === 0
                                ? "User not found"
                                : "Found users with overlapping ids",
                    });
                }
                const { imageId } = data[0]!;
                if (imageId !== input.id)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You can only delete your own profile images",
                    });
            }

            const utapi = new UTApi();
            const utDelete = await tryCatch(
                utapi.deleteFiles(assetData.uploadthingId),
            );
            if (!utDelete.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Uploadthing failed to delete asset",
                });
            }

            const dbDelete = await tryCatch(
                ctx.db.delete(asset).where(eq(asset.id, input.id)),
            );
            if (!dbDelete.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Database failed to delete asset",
                });
            }

            return;
        }),
});
