import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { asset } from "@/server/db/schema";
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
                    .select({ id: asset.id, type: asset.type, url: asset.url })
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
            const row = data[0]!;
            if (row.type !== "recording") {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Recording not found",
                });
            }
            return { id: row.id, url: row.url };
        }),

    delete: protectedProcedure("guest")
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .select()
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
            const assetData = data[0]!;

            if (assetData.type === "recording") {
                const userRole = parseUserRole(ctx.session?.user?.role);
                const hasAccess = checkVisibility(userRole, "members");
                if (!hasAccess)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You must be a member to delete recordings",
                    });
            } else if (assetData.type === "profile-image") {
                if (assetData.uploadedBy !== ctx.session.user.id) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You can only delete your own profile images",
                    });
                }
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
                ctx.db
                    .delete(asset)
                    .where(eq(asset.id, input.id))
                    .returning({ id: asset.id }),
            );
            if (!dbDelete.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Database failed to delete asset",
                });
            }
            const rows = dbDelete.unwrap();
            if (rows.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Asset not found",
                });
            }

            return;
        }),
});
