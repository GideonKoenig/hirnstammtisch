import { redirect } from "next/navigation";
import { readCookie } from "~/server/utils";

export default function LoginLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const userName = readCookie("username");
    if (userName) {
        redirect("/profile");
    }

    return children;
}
