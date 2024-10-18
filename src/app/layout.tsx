import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import PlausibleProvider from "next-plausible";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Hirnstamm Tisch",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <head>
                <PlausibleProvider domain="hirnstammtisch.com" selfHosted />
            </head>
            <body className="h-screen w-screen bg-menu-main text-text-normal">{children}</body>
        </html>
    );
}
