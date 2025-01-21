import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserCard from "~/components/newComponents/user-card";
import EditableTextField from "~/components/ui/editable-text-field/editable-text-field";
import { db } from "~/server/db";
import { updateUser } from "~/user/db";

export default async function Profil() {
    const userName = cookies().get("username")?.value;

    const user = await db.query.UserTable.findFirst({
        where: (user, { eq }) => eq(user.name, userName ?? ""),
    });

    if (!user) {
        return redirect("/login");
    }

    return (
        <div>
            <UserCard user={user} />
            <EditableTextField cookieName="username" callback={updateUser} />
        </div>
    );
}
