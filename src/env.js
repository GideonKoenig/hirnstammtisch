import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        PLAUSIBLE_CUSTOM_DOMAIN: z.string().url().optional(),
        SITE_URL: z.string().url(),
        DATABASE_URL: z.string().url(),
        UPLOADTHING_TOKEN: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_URL: z.string().url(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
    },

    client: {},

    runtimeEnv: {
        PLAUSIBLE_CUSTOM_DOMAIN: process.env.PLAUSIBLE_CUSTOM_DOMAIN,
        SITE_URL: process.env.SITE_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NODE_ENV: process.env.NODE_ENV,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
