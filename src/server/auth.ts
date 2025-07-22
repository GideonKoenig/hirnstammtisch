import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import { env } from "@/env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    user: {
        additionalFields: {
            imageId: {
                type: "string",
                required: false,
                defaultValue: null,
                input: true,
            },
            role: {
                type: "string",
                required: true,
                defaultValue: "guest",
                input: true,
            },
            useProviderImage: {
                type: "boolean",
                required: true,
                defaultValue: true,
                input: true,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
});
