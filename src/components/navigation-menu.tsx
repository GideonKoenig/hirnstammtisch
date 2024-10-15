import Link from "next/link";
import Icon from "assets/brain-dark.svg";

export function NavigationBar() {
    return (
        <div className="flex flex-row items-center gap-4 border-b border-neutral-600 p-2">
            <Link
                className="flex flex-row items-center gap-1 rounded px-4 hover:bg-neutral-600"
                href="/"
            >
                <Icon className="h-12 w-12" />
                <p>Hirnstamm Tisch</p>
            </Link>
            <div className="w-28" />
            <Link
                className="flex h-12 items-center rounded px-4 hover:bg-neutral-600"
                href="/topics"
            >
                <p>Topics</p>
            </Link>
            <Link
                className="flex h-12 items-center rounded px-4 hover:bg-neutral-600"
                href="/events"
            >
                <p>Events</p>
            </Link>
        </div>
    );
}
