"use client";

import { Bookmark, Home, Text, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationBar(props: { username: string | undefined }) {
    const path = usePathname();

    return (
        <div className="flex w-full flex-row items-center gap-1">
            <Link
                data-active={path === "/"}
                className="data-[active=true]:text-accent flex flex-grow flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[active=true]:bg-menu-hover"
                href="/"
            >
                <Home className="aspect-square h-4" />
                <p className="text-xs md:text-base">Home</p>
            </Link>

            <Link
                data-active={path === "/events"}
                className="data-[active=true]:text-accent flex flex-grow flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[active=true]:bg-menu-hover"
                href="/events"
            >
                <Bookmark className="aspect-square h-4" />
                <p className="text-xs md:text-base">Events</p>
            </Link>
            <Link
                data-active={path === "/about"}
                className="data-[active=true]:text-accent flex flex-grow flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[active=true]:bg-menu-hover"
                href="/about"
            >
                <Text className="aspect-square h-4" />
                <p className="text-xs md:text-base">About</p>
            </Link>

            <Link
                data-hidden={props.username === undefined}
                data-active={path === "/profile"}
                className="data-[active=true]:text-accent flex flex-grow flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[hidden=true]:hidden data-[active=true]:bg-menu-hover"
                href="/profil"
            >
                <User className="aspect-square h-4" />
                <p className="text-xs md:text-base">{props.username}</p>
            </Link>
            <Link
                data-hidden={props.username !== undefined}
                data-active={path === "/login"}
                className="data-[active=true]:text-accent flex flex-grow flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[hidden=true]:hidden data-[active=true]:bg-menu-hover"
                href="/login"
            >
                <User className="aspect-square h-4" />
                <p className="text-xs md:text-base">Login</p>
            </Link>
        </div>
    );
}
