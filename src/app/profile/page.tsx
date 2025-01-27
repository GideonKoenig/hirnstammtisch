"use client";

import { redirect } from "next/navigation";
import UserForm from "~/components/user-form";
import { useData } from "~/components/data-provider";

export default function Profil() {
    const { activeUser } = useData();

    if (!activeUser) redirect("/login");

    return (
        <div className="h-full w-full p-2">
            <div className="mx-auto flex w-full max-w-xl">
                <UserForm user={activeUser} />
            </div>
        </div>
    );
}
