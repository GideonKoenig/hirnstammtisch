"use client";

import {
    Bookmark,
    Calendar,
    Home,
    Text,
    User,
    type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Link } from "@/components/ui/fast-link";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function NavigationBar(props: { className?: string }) {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();

    const navigationConfig: {
        href: string;
        icon: LucideIcon;
        label: string;
        hide?: boolean;
    }[] = [
        {
            href: "/events",
            icon: Bookmark,
            label: "Events",
        },
        {
            href: "/calendar",
            icon: Calendar,
            label: "Calendar",
        },
        {
            href: "/about",
            icon: Text,
            label: "About",
        },
        {
            href: "/profile",
            icon: User,
            label: "Profile",
            hide: !session,
        },
        {
            href: "/signin",
            icon: User,
            label: "Sign In",
            hide: !!session,
        },
    ];

    return (
        <div
            className={cn(
                "grid w-full grid-cols-5 items-center gap-1 lg:grid-cols-7 lg:gap-4",
                props.className,
            )}
        >
            <Link
                data-active={pathname === "/"}
                className="hover:bg-bg-muted flex flex-col items-center rounded px-4 py-2 lg:mt-1 lg:flex-row lg:gap-2 lg:py-1"
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
                <span className="text-xs md:text-base lg:text-lg lg:font-bold">
                    Home
                </span>
            </Link>

            <div className="hidden lg:block" />

            {navigationConfig.map((item) => {
                if (item.hide) return;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        className={cn(
                            "hover:bg-bg-muted flex flex-col items-center rounded px-4 py-2 lg:mt-1 lg:py-2",
                            isActive && "text-accent",
                        )}
                        href={item.href}
                    >
                        <item.icon className="aspect-square h-4 md:h-5 lg:hidden" />
                        <span className="text-xs md:text-base lg:text-lg lg:font-bold">
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
