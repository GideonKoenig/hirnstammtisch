import { redirect } from "next/navigation";
import { readCookie } from "~/server/utils";

export default async function LoginLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const userName = await readCookie("username");
    if (userName) {
        redirect("/profile");
    }

    return children;
}
