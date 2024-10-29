import Link from "next/link";
import Icon from "assets/brain-dark.svg";
import EditableTextField from "src/components/ui/editable-text-field/editable-text-field";
import { updateUser } from "~/user/db";

export function NavigationBar() {
    return (
        <div className="flex w-full flex-row items-center gap-4 border-b border-menu-hover p-2">
            <Link
                className="flex flex-row items-center gap-1 rounded px-4 hover:bg-menu-hover"
                href="/"
            >
                <Icon className="h-12 w-12" />
                <p>Hirnstamm Tisch</p>
            </Link>
            <div className="w-28" />
            <Link
                className="flex h-12 items-center rounded px-4 hover:bg-menu-hover"
                href="/topics"
            >
                <p>Topics</p>
            </Link>
            <Link
                className="flex h-12 items-center rounded px-4 hover:bg-menu-hover"
                href="/events"
            >
                <p>Events</p>
            </Link>
            <div className="flex-grow" />
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
