import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { db } from "@/server/db";
import { getSession } from "@/server/utils";
import { headers } from "next/headers";
import { asset, eventAttachment } from "@/server/db/schema";
import { tryCatch } from "@/lib/try-catch";
import z from "zod";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const fileRouter = {
    profileImageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const session = await getSession(await headers());
            if (!session?.user) throw new Error("Unauthorized");
            return { user: session.user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const assetElement = await tryCatch(
                db
                    .insert(asset)
                    .values({
                        type: "image",
                        name: "Profile Image",
                        uploadthingId: file.key,
                        url: file.ufsUrl,
                        uploadedBy: metadata.user.id,
                    })
                    .returning(),
            );

            if (!assetElement.success || assetElement.data.length !== 1) {
                const utapi = new UTApi();
                await utapi.deleteFiles(file.key);
                assetElement.unwrap();
                return;
            }

            return { assetId: assetElement.data[0]!.id };
        }),

    eventAttachmentUploader: f({
        video: {
            maxFileSize: "1GB",
            maxFileCount: 1,
        },
        audio: {
            maxFileSize: "128MB",
            maxFileCount: 1,
        },
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .input(
            z.object({
                eventId: z.string(),
            }),
        )
        .middleware(async ({ input }) => {
            const session = await getSession(await headers());
            if (!session?.user) throw new Error("Unauthorized");
            return {
                user: session.user,
                eventId: input.eventId,
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const type = file.type.startsWith("audio/")
                ? "audio"
                : file.type.startsWith("image/")
                  ? "image"
                  : "video";
            const name = type.charAt(0).toUpperCase() + type.slice(1);
            const assetElement = await tryCatch(
                db
                    .insert(asset)
                    .values({
                        type,
                        name,
                        uploadthingId: file.key,
                        url: file.ufsUrl,
                        uploadedBy: metadata.user.id,
                    })
                    .returning(),
            );

            if (!assetElement.success || assetElement.data.length !== 1) {
                const utapi = new UTApi();
                await utapi.deleteFiles(file.key);
                assetElement.unwrap();
                return;
            }
            const assetId = assetElement.data[0]!.id;

            const eventAttachmentElement = await tryCatch(
                db.insert(eventAttachment).values({
                    eventId: metadata.eventId,
                    assetId,
                }),
            );
            if (!eventAttachmentElement.success) {
                const utapi = new UTApi();
                await utapi.deleteFiles(file.key);
                db.delete(asset).where(eq(asset.id, assetId));
                eventAttachmentElement.unwrap();
                return;
            }

            return { assetId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
