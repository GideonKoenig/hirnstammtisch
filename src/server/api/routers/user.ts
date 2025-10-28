import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { user, asset } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { redactUser } from "@/server/utils";
import { tryCatch } from "@/lib/try-catch";
import { UTApi } from "uploadthing/server";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const result = await tryCatch(ctx.db.select().from(user));
        const users = result.unwrap();
        const redactedUsers = await redactUser(
            users,
            ctx.session?.user,
            ctx.db,
        );
        return redactedUsers;
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .select()
                    .from(user)
                    .where(eq(user.id, input.id))
                    .limit(1),
            );
            const users = result.unwrap();
            if (users.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }
            const redactedUser = await redactUser(
                users[0]!,
                ctx.session?.user,
                ctx.db,
            );
            return redactedUser;
        }),

    getImage: protectedProcedure()
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .select({
                        image: user.image,
                        useProviderImage: user.useProviderImage,
                        assetUrl: asset.url,
                    })
                    .from(user)
                    .leftJoin(asset, eq(asset.id, user.uploadedImageAssetId))
                    .where(eq(user.id, input.id))
                    .limit(1),
            );
            const data = result.unwrap();
            if (data.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }
            const imageData = data[0]!;

            const imageUrl = imageData.useProviderImage
                ? (imageData.image?.replace(/=s\d+-c$/, "=s512-c") ?? null)
                : (imageData.assetUrl ?? null);
            return imageUrl;
        }),

    setRole: protectedProcedure("admin")
        .input(
            z.object({
                id: z.string(),
                role: z.enum(["guest", "member", "admin"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .update(user)
                    .set({ role: input.role, updatedAt: new Date() })
                    .where(eq(user.id, input.id))
                    .returning({ id: user.id }),
            );
            if (!result.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update user role",
                });
            }
            const rows = result.unwrap();
            if (rows.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }
            return;
        }),

    setCreatedAt: protectedProcedure("admin")
        .input(z.object({ id: z.string(), createdAt: z.date() }))
        .mutation(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .update(user)
                    .set({ createdAt: input.createdAt, updatedAt: new Date() })
                    .where(eq(user.id, input.id))
                    .returning({ id: user.id }),
            );
            if (!result.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update user creation date",
                });
            }
            const rows = result.unwrap();
            if (rows.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }
            return;
        }),

    deleteProfileImageAsset: protectedProcedure("member")
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const assetRowRes = await tryCatch(
                ctx.db
                    .select({
                        id: asset.id,
                        uploadedBy: asset.uploadedBy,
                        uploadthingId: asset.uploadthingId,
                    })
                    .from(asset)
                    .where(eq(asset.id, input.id))
                    .limit(1),
            );
            const assetRows = assetRowRes.unwrap();
            if (assetRows.length !== 1) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Asset not found",
                });
            }
            const row = assetRows[0]!;
            if (row.uploadedBy !== ctx.session.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You can only delete your own profile images",
                });
            }

            const utapi = new UTApi();
            const utDelete = await tryCatch(
                utapi.deleteFiles(row.uploadthingId),
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
            if (!dbDelete.success || dbDelete.data.length !== 1) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Database failed to delete asset",
                });
            }

            return;
        }),
});
