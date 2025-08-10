import { redirect } from "next/navigation";
import { getSession } from "@/server/utils";
import { headers } from "next/headers";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileImage } from "@/components/profile/profile-image";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfilePreferences } from "@/components/profile/profile-preferences";
import { api, HydrateClient } from "@/trpc/server";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
    description: "Manage your account settings and preferences.",
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
    alternates: { canonical: "/profile" },
};

export default async function Profile() {
    const session = await getSession(await headers());
    if (!session?.user) redirect("/signin");

    void api.preference.get.prefetch();
    void api.user.getImage.prefetch({ id: session.user.id });

    return (
        <HydrateClient>
            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 p-4 md:p-6 lg:grid-cols-3">
                <PageHeader
                    title="Profile"
                    subtitle="Manage your account settings and preferences"
                    className="lg:col-span-3"
                />
                <ProfileHeader className="flex justify-end lg:col-span-3" />
                <ProfileImage className="lg:col-span-1" />
                <ProfileInfo className="lg:col-span-2" />
                <ProfilePreferences className="lg:col-span-3" />
            </div>
        </HydrateClient>
    );
}
