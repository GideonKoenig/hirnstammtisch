import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import PlausibleProvider from "next-plausible";
import { type Viewport, type Metadata } from "next";
import { NavigationBar } from "~/components/navigation-menu";
import { cookies } from "next/headers";
import { NextSSRPlugin as UploadThingProvider } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "~/app/api/uploadthing/core";
import { PwaProvider } from "~/components/pwa-provider";
import { PwaInstallPopup } from "~/components/pwa-install-popup";
import { DataProvider } from "~/components/data-provider";
import { db } from "~/server/db";
import { PwaInstallPopupIos } from "~/components/pwa-install-popup-ios";

const APP_NAME = "HirnstammTisch";
const APP_DEFAULT_TITLE = "HirnstammTisch";
const APP_TITLE_TEMPLATE = "%s - HirnstammTisch";
const APP_DESCRIPTION = "Let's talk about stuff.";

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: APP_DEFAULT_TITLE,
        startupImage: "/favicon.ico",
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: "#212425",
};

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const cookieStore = await cookies();
    const username = cookieStore.get("username")?.value;
    const [events, users] = await Promise.all([
        db.query.EventsTable.findMany(),
        db.query.UserTable.findMany(),
    ]);

    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <head>
                <PlausibleProvider domain="hirnstammtisch.com" selfHosted />
            </head>
            <body className="bg-menu-main text-text-normal relative flex h-dvh w-dvw flex-col-reverse overflow-hidden lg:flex-col">
                <DataProvider
                    events={events}
                    users={users}
                    activeUserName={username}
                >
                    <PwaProvider>
                        <UploadThingProvider
                            routerConfig={extractRouterConfig(fileRouter)}
                        />
                        <PwaInstallPopup />
                        <PwaInstallPopupIos />
                        <NavigationBar />
                        <main className="grow overflow-auto">{children}</main>
                    </PwaProvider>
                </DataProvider>
            </body>
        </html>
    );
}
