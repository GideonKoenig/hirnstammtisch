"use client";

import { Bookmark, Calendar, Home, Text, User } from "lucide-react";
import Icon from "assets/brain-dark.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationBar(props: { username: string | undefined }) {
    const path = usePathname();

    return (
        <div className="grid w-full grid-cols-5 items-center gap-1 lg:grid-cols-7 lg:gap-4 lg:border-b lg:border-menu-light">
            <Link
                data-active={path === "/"}
                className="flex flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent lg:flex-row lg:gap-2 lg:py-0 lg:text-accent lg:hover:bg-menu-main data-[active=true]:lg:bg-menu-main"
                href="/"
            >
                <Home className="aspect-square h-4 md:h-5 lg:hidden" />
                <Icon className="hidden h-10 w-10 lg:block" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Home
                </p>
            </Link>

            <div className="hidden lg:block" />

            <Link
                data-active={path === "/events"}
                className="flex flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:py-4 lg:hover:bg-menu-main data-[active=true]:lg:bg-menu-main data-[active=true]:lg:text-text-normal data-[active=true]:lg:hover:bg-menu-main"
                href="/events"
            >
                <Bookmark className="aspect-square h-4 md:h-5 lg:hidden" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Events
                </p>
            </Link>

            <Link
                data-active={path === "/calendar"}
                className="flex flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:py-4 lg:hover:bg-menu-main data-[active=true]:lg:bg-menu-main data-[active=true]:lg:text-text-normal data-[active=true]:lg:hover:bg-menu-main"
                href="/calendar"
            >
                <Calendar className="aspect-square h-4 md:h-5 lg:hidden" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Calendar
                </p>
            </Link>

            <Link
                data-active={path === "/about"}
                className="flex flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:py-4 lg:hover:bg-menu-main data-[active=true]:lg:bg-menu-main data-[active=true]:lg:text-text-normal data-[active=true]:lg:hover:bg-menu-main"
                href="/about"
            >
                <Text className="aspect-square h-4 md:h-5 lg:hidden" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    About
                </p>
            </Link>

            <div className="hidden lg:block" />

            <Link
                data-hidden={props.username === undefined}
                data-active={path === "/profile"}
                className="flex flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[hidden=true]:hidden data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:py-4 lg:hover:bg-menu-main data-[active=true]:lg:bg-menu-main data-[active=true]:lg:text-text-normal data-[active=true]:lg:hover:bg-menu-main"
                href="/profile"
            >
                <User className="aspect-square h-4 md:h-5 lg:hidden" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Profile
                </p>
            </Link>
            <Link
                data-hidden={props.username !== undefined}
                data-active={path === "/login"}
                className="flex flex-col items-center rounded px-4 py-2 hover:bg-menu-hover data-[hidden=true]:hidden data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:py-4 lg:hover:bg-menu-main data-[active=true]:lg:bg-menu-main data-[active=true]:lg:text-text-normal data-[active=true]:lg:hover:bg-menu-main"
                href="/login"
            >
                <User className="aspect-square h-4 md:h-5 lg:hidden" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Login
                </p>
            </Link>
        </div>
    );
}
