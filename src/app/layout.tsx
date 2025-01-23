import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import PlausibleProvider from "next-plausible";
import { type Metadata } from "next";
import { NavigationBar } from "~/components/newComponents/navigation-menu";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "HirnstammTisch",
    description: "Let's talk about stuff.",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/favicon.ico",
                href: "/favicon.ico",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/favicon-dark.ico",
                href: "/favicon-dark.ico",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const username = cookies().get("username")?.value;

    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <head>
                <PlausibleProvider domain="hirnstammtisch.com" selfHosted />
            </head>
            <body className="flex h-screen w-screen flex-col-reverse bg-menu-main text-text-normal lg:flex-col">
                <NavigationBar username={username} />
                <main className="flex-grow overflow-hidden">{children}</main>
            </body>
        </html>
    );
}
