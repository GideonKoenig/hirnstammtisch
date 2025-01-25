import { cookies } from "next/headers";

export function readCookie(name: string) {
    const cookieStore = cookies();
    return cookieStore.get(name)?.value ?? undefined;
}
