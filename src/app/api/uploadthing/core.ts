import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { UserTable } from "~/server/db/schema";

const f = createUploadthing();

const auth = async () => {
    const username = cookies().get("username")?.value;
    if (!username) return undefined;

    const user = await db.query.UserTable.findFirst({
        where: (users, { eq }) => eq(users.name, username),
    });
    return user;
};

export const fileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const user = await auth();
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            if (!user) throw new UploadThingError("Unauthorized");

            return { user: user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db
                .update(UserTable)
                .set({
                    imageUrl: file.url,
                })
                .where(eq(UserTable.id, metadata.user.id));
            revalidatePath("/profile");
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
