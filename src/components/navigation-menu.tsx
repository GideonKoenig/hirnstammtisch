"use client";

import { Bookmark, Calendar, Home, Text, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function NavigationBar(props: { username: string | undefined }) {
    const path = usePathname();

    return (
        <div className="lg:border-menu-light grid w-full grid-cols-5 items-center gap-1 lg:grid-cols-7 lg:gap-4 lg:border-b">
            <Link
                data-active={path === "/"}
                className="hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent lg:text-accent lg:hover:bg-menu-main lg:data-[active=true]:bg-menu-main flex flex-col items-center rounded px-4 py-2 lg:flex-row lg:gap-2 lg:py-0"
                href="/"
            >
                <Home className="aspect-square h-4 md:h-5 lg:hidden" />
                <Image
                    className="hidden lg:block"
                    src={"icon.svg"}
                    alt="HirnstammTisch"
                    width={40}
                    height={40}
                />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Home
                </p>
            </Link>

            <div className="hidden lg:block" />

            <Link
                data-active={path === "/events"}
                className="hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:hover:bg-menu-main lg:data-[active=true]:bg-menu-main lg:data-[active=true]:text-text-normal lg:data-[active=true]:hover:bg-menu-main flex flex-col items-center rounded px-4 py-2 lg:py-4"
                href="/events"
            >
                <Bookmark className="aspect-square h-4 md:h-5 lg:hidden" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Events
                </p>
            </Link>

            <Link
                data-active={path === "/calendar"}
                className="hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:hover:bg-menu-main lg:data-[active=true]:bg-menu-main lg:data-[active=true]:text-text-normal lg:data-[active=true]:hover:bg-menu-main flex flex-col items-center rounded px-4 py-2 lg:py-4"
                href="/calendar"
            >
                <Calendar className="aspect-square h-4 md:h-5 lg:hidden" />
                <p className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Calendar
                </p>
            </Link>

            <Link
                data-active={path === "/about"}
                className="hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:hover:bg-menu-main lg:data-[active=true]:bg-menu-main lg:data-[active=true]:text-text-normal lg:data-[active=true]:hover:bg-menu-main flex flex-col items-center rounded px-4 py-2 lg:py-4"
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
                className="hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:hover:bg-menu-main lg:data-[active=true]:bg-menu-main lg:data-[active=true]:text-text-normal lg:data-[active=true]:hover:bg-menu-main flex flex-col items-center rounded px-4 py-2 data-[hidden=true]:hidden lg:py-4"
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
                className="hover:bg-menu-hover data-[active=true]:bg-menu-hover data-[active=true]:text-accent data-[active=true]:hover:bg-menu-hover lg:hover:bg-menu-main lg:data-[active=true]:bg-menu-main lg:data-[active=true]:text-text-normal lg:data-[active=true]:hover:bg-menu-main flex flex-col items-center rounded px-4 py-2 data-[hidden=true]:hidden lg:py-4"
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
