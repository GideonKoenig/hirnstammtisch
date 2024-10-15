import Link from "next/link";
import Icon from "assets/brain-dark.svg";

export function NavigationBar() {
    return (
        <div className="border-menu-hover flex flex-row items-center gap-4 border-b p-2">
            <Link
                className="hover:bg-menu-hover flex flex-row items-center gap-1 rounded px-4"
                href="/"
            >
                <Icon className="h-12 w-12" />
                <p>Hirnstamm Tisch</p>
            </Link>
            <div className="w-28" />
            <Link
                className="hover:bg-menu-hover flex h-12 items-center rounded px-4"
                href="/topics"
            >
                <p>Topics</p>
            </Link>
            <Link
                className="hover:bg-menu-hover flex h-12 items-center rounded px-4"
                href="/events"
            >
                <p>Events</p>
            </Link>
        </div>
    );
}
