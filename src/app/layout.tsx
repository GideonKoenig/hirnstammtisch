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
import { env } from "@/env";

const APP_NAME = "HirnStammtisch";
const APP_DEFAULT_TITLE = "HirnStammtisch";
const APP_TITLE_TEMPLATE = "%s";
const APP_DESCRIPTION =
    "Join upcoming HirnStammtisch talks and explore our archive of past sessions.";

export const metadata: Metadata = {
    metadataBase: new URL(env.SITE_URL),
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
        icon: [
            { url: "/favicon.ico" },
            {
                url: "/icon-light.svg",
                media: "(prefers-color-scheme: light)",
                type: "image/svg+xml",
            },
            {
                url: "/icon-dark.svg",
                media: "(prefers-color-scheme: dark)",
                type: "image/svg+xml",
            },
        ],
        apple: "/ios/180.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#060606",
    viewportFit: "cover",
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
                <PlausibleProvider
                    domain={new URL(env.SITE_URL).hostname}
                    selfHosted
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "HirnStammtisch",
                            alternateName: [
                                "Hirnstammtisch",
                                "HirnstammTisch",
                                "Hirnstamm Tisch",
                                "Hirn Stammtisch",
                            ],
                            url: env.SITE_URL,
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "HirnStammtisch",
                            url: env.SITE_URL,
                            logo: `${env.SITE_URL}/icon.webp`,
                        }),
                    }}
                />
            </head>
            <TRPCReactProvider>
                <PwaProvider>
                    <body className="bg-bg text-text relative h-svh w-screen overflow-hidden">
                        <UploadThingProvider
                            routerConfig={extractRouterConfig(fileRouter)}
                        />
                        <ScrollArea className="h-full w-full">
                            <div className="flex min-h-svh flex-col">
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
