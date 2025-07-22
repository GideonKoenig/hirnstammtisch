import { AboutHeader } from "@/components/about/about-header";
import { MemberList } from "@/components/about/member-list";
import { api, HydrateClient } from "@/trpc/server";

export default async function About() {
    void api.user.getAll.prefetch();
    void api.event.getAll.prefetch();

    return (
        <HydrateClient>
            <div className="mx-auto max-w-4xl">
                <AboutHeader />
                <MemberList />
            </div>
        </HydrateClient>
    );
}
