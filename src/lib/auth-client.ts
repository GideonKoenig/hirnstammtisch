import { type UserRole } from "@/lib/permissions/types";
import { type auth } from "@/server/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
});
export type User = typeof authClient.$Infer.Session.user & {
    role: UserRole;
};
