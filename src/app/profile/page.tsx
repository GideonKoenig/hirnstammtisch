import { redirect } from "next/navigation";
import { db } from "~/server/db";
import UserForm from "~/components/user-form";
import { readCookie } from "~/server/utils";

export default async function Profil() {
    const userName = readCookie("username");

    const user = await db.query.UserTable.findFirst({
        where: (user, { eq }) => eq(user.name, userName ?? ""),
    });

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="h-full w-full p-2">
            <div className="mx-auto flex w-full max-w-xl">
                <UserForm user={user} />
            </div>
        </div>
    );
}
