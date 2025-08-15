import { MemberList } from "@/components/about/member-list";
import { api, HydrateClient } from "@/trpc/server";
import { PageHeader } from "@/components/ui/page-header";
import { type Metadata } from "next";
import { env } from "@/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "About",
    description:
        "The HirnstammTisch is a small group of people who meet regularly to discuss interesting topics.",
    alternates: { canonical: "/about" },
    openGraph: {
        title: "About - HirnstammTisch",
        description:
            "Learn about the HirnstammTisch community and its members.",
        url: `${env.SITE_URL}/about`,
    },
};

export default async function About() {
    void api.user.getAll.prefetch();
    void api.event.getAll.prefetch();

    return (
        <HydrateClient>
            <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
                <PageHeader
                    title="About"
                    subtitle="The HirnstammTisch is a small group of people who meet regularly to discuss interesting topics."
                    className="mb-6 md:mb-8"
                />
                <MemberList />
            </div>
        </HydrateClient>
    );
}
