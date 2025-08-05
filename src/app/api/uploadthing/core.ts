import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { db } from "@/server/db";
import { getSession } from "@/server/utils";
import { headers } from "next/headers";
import { asset } from "@/server/db/schema";
import { tryCatch } from "@/lib/try-catch";

const f = createUploadthing();

export const fileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const session = await getSession(await headers());
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { user: session.user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const assetElement = await tryCatch(
                db
                    .insert(asset)
                    .values({
                        type: "profile-image",
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

    videoAudioUploader: f({
        video: {
            maxFileSize: "1GB",
            maxFileCount: 1,
        },
        audio: {
            maxFileSize: "128MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const session = await getSession(await headers());
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { user: session.user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const assetElement = await tryCatch(
                db
                    .insert(asset)
                    .values({
                        type: "recording",
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
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
