import { auth } from "@/server/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { type UserRole } from "@/lib/permissions/redact-fields";

export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
});
export type User = typeof authClient.$Infer.Session.user & {
    role: UserRole;
};
