"use client";

import { authClient, type User } from "@/lib/auth-client";

export function useUser() {
    return authClient.useSession().data?.user as User | null;
}
