import { cookies } from "next/headers";

export function readCookie(name: string) {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value ?? undefined;
}
