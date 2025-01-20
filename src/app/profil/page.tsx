import Link from "next/link";
import EditableTextField from "~/components/ui/editable-text-field/editable-text-field";
import { updateUser } from "~/user/db";

export default function Profil() {
    return (
        <div>
            Profil
            <EditableTextField
                cookieName="username"
                callback={updateUser}
                fallback={
                    <Link
                        className="flex h-12 items-center rounded px-4 hover:bg-menu-hover"
                        href="/login"
                    >
                        <p>Login</p>
                    </Link>
                }
            />
        </div>
    );
}
