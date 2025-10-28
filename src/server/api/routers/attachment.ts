import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { asset, eventAttachment } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { tryCatch } from "@/lib/try-catch";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { redactAssets } from "@/server/utils";

export const attachmentRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(z.object({ eventId: z.string() }))
        .query(async ({ ctx, input }) => {
            const result = await tryCatch(
                ctx.db
                    .select({
                        id: asset.id,
                        type: asset.type,
                        name: asset.name,
                        url: asset.url,
                        uploadthingId: asset.uploadthingId,
                        createdAt: asset.createdAt,
                        uploadedBy: asset.uploadedBy,
                    })
                    .from(eventAttachment)
                    .innerJoin(asset, eq(eventAttachment.assetId, asset.id))
                    .where(eq(eventAttachment.eventId, input.eventId)),
            );
            const rows = result.unwrap();
            const redactedAssets = await redactAssets(
                rows,
                ctx.session?.user,
                ctx.db,
            );
            return redactedAssets;
        }),

    update: protectedProcedure("member")
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                url: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const currentRes = await tryCatch(
                ctx.db
                    .select()
                    .from(asset)
                    .where(eq(asset.id, input.id))
                    .limit(1),
            );
            const current = currentRes.unwrap()[0];
            if (!current) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Attachment not found",
                });
            }

            if (input.url && current.type !== "link") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only link attachments can update URL",
                });
            }

            const updated = await tryCatch(
                ctx.db
                    .update(asset)
                    .set({
                        name: input.name ?? current.name,
                        url: input.url ?? current.url,
                        createdAt: current.createdAt,
                    })
                    .where(eq(asset.id, input.id))
                    .returning({ id: asset.id }),
            );
            if (!updated.success || updated.data.length !== 1) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update attachment",
                });
            }
            return;
        }),

    delete: protectedProcedure("member")
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const getRes = await tryCatch(
                ctx.db
                    .select()
                    .from(asset)
                    .where(eq(asset.id, input.id))
                    .limit(1),
            );
            const row = getRes.unwrap()[0];
            if (!row) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Attachment not found",
                });
            }

            const unlinkRes = await tryCatch(
                ctx.db
                    .delete(eventAttachment)
                    .where(eq(eventAttachment.assetId, input.id))
                    .returning({
                        eventId: eventAttachment.eventId,
                        assetId: eventAttachment.assetId,
                    }),
            );
            if (!unlinkRes.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to unlink attachment",
                });
            }

            if (row.type !== "link") {
                const utapi = new UTApi();
                const utDelete = await tryCatch(
                    utapi.deleteFiles(row.uploadthingId),
                );
                if (!utDelete.success) {
                    const removedLink = unlinkRes.data[0]!;
                    const restoreRes = await tryCatch(
                        ctx.db.insert(eventAttachment).values({
                            eventId: removedLink.eventId,
                            assetId: removedLink.assetId,
                        }),
                    );
                    restoreRes.unwrap();

                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to delete file",
                    });
                }
            }

            const delRes = await tryCatch(
                ctx.db
                    .delete(asset)
                    .where(eq(asset.id, input.id))
                    .returning({ id: asset.id }),
            );
            if (!delRes.success || delRes.data.length !== 1) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete attachment",
                });
            }
            return;
        }),

    createLink: protectedProcedure("member")
        .input(
            z.object({
                eventId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const inserted = await tryCatch(
                ctx.db
                    .insert(asset)
                    .values({
                        type: "link",
                        name: "Slides",
                        uploadthingId: "",
                        url: "https://example.com",
                        uploadedBy: ctx.session.user.id,
                    })
                    .returning({ id: asset.id }),
            );
            if (!inserted.success || inserted.data.length !== 1) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create link",
                });
            }
            const newId = inserted.data[0]!.id;

            const linkRes = await tryCatch(
                ctx.db
                    .insert(eventAttachment)
                    .values({ eventId: input.eventId, assetId: newId }),
            );
            if (!linkRes.success) {
                await ctx.db.delete(asset).where(eq(asset.id, newId));
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to link attachment",
                });
            }
            return { id: newId };
        }),
});
