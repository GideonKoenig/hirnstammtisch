import { cookies } from "next/headers";

export function readCookie(name: string) {
    return cookies().get(name)?.value ?? undefined;
}
