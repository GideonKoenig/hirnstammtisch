import { redirect } from "next/navigation";
import { getSession } from "@/server/utils";
import { headers } from "next/headers";

export default async function LoginLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await getSession(await headers());
    if (session?.user) {
        redirect("/profile");
    }
    return children;
}
