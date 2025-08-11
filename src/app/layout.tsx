import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import PlausibleProvider from "next-plausible";
import { type Viewport, type Metadata } from "next";
import { NavigationBar } from "@/components/navigation-menu";
import { NextSSRPlugin as UploadThingProvider } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "@/app/api/uploadthing/core";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { PwaInstallPopup } from "@/components/pwa/pwa-install-popup";
import { PwaInstallPopupIos } from "@/components/pwa/pwa-install-popup-ios";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense } from "react";

const APP_NAME = "HirnstammTisch";
const APP_DEFAULT_TITLE = "HirnstammTisch";
const APP_TITLE_TEMPLATE = "%s - HirnstammTisch";
const APP_DESCRIPTION = "Let's talk about stuff.";

export const metadata: Metadata = {
    metadataBase: new URL("https://hirnstammtisch.com"),
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    alternates: {
        canonical: "/",
    },
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
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
        images: [{ url: "/icon.webp" }],
    },
    twitter: {
        card: "summary_large_image",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
        images: ["/icon.webp"],
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/ios/180.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#060606",
};

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${GeistSans.variable}`}
        >
            <head>
                <PlausibleProvider domain="hirnstammtisch.com" selfHosted />
            </head>
            <TRPCReactProvider>
                <PwaProvider>
                    <body className="bg-bg text-text relative h-dvh w-dvw overflow-hidden">
                        <UploadThingProvider
                            routerConfig={extractRouterConfig(fileRouter)}
                        />
                        <ScrollArea className="h-full w-full">
                            <div className="flex min-h-dvh flex-col">
                                <NavigationBar className="hidden lg:grid" />
                                <main className="flex grow flex-col p-4 md:p-6 lg:p-8">
                                    {children}
                                </main>
                                <NavigationBar className="bg-bg sticky bottom-0 lg:hidden" />
                            </div>
                        </ScrollArea>
                        <Toaster closeButton />
                        <Suspense fallback={null}>
                            <PwaInstallPopup />
                            <PwaInstallPopupIos />
                        </Suspense>
                    </body>
                </PwaProvider>
            </TRPCReactProvider>
        </html>
    );
}
