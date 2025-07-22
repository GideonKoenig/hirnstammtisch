import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { user, asset } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { tryCatchAsync } from "@/lib/try-catch";
import { TRPCError } from "@trpc/server";
import { redactUser } from "@/server/utils";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const users = await tryCatchAsync(async () => {
            return await ctx.db.select().from(user);
        }).unwrap({ errorMessage: "Failed to fetch users" });

        const redactedUsers = await redactUser(users, ctx.session?.user);

        return redactedUsers;
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const users = await tryCatchAsync(async () => {
                return await ctx.db
                    .select()
                    .from(user)
                    .where(eq(user.id, input.id))
                    .limit(1);
            }).unwrap({
                expectation: "expectSingle",
                notFoundMessage: "User not found",
            });

            return users;
        }),

    getImage: protectedProcedure
        .input(z.object({ id: z.string().optional() }).optional())
        .query(async ({ ctx, input }) => {
            const userId = input?.id ?? ctx.session.user.id;
            const userData = await tryCatchAsync(
                async () =>
                    await ctx.db
                        .select({
                            id: user.id,
                            name: user.name,
                            image: user.image,
                            useProviderImage: user.useProviderImage,
                            assetUrl: asset.url,
                        })
                        .from(user)
                        .leftJoin(asset, eq(asset.id, user.imageId))
                        .where(eq(user.id, userId))
                        .limit(1),
            ).unwrap({
                expectation: "expectSingle",
                notFoundMessage: "User not found",
                errorMessage: "Failed to fetch user profile image",
            });
            const imageUrl = userData.useProviderImage
                ? (userData.image?.replace(/=s\d+-c$/, "=s512-c") ?? null)
                : (userData.assetUrl ?? null);
            return imageUrl;
        }),
});
