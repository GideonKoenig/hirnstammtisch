import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/server/utils";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { event } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import eventsJson from "@data/events.json";
import usersJson from "@data/users.json";
import { UserAdmin } from "@/components/admin/user-admin";
import { DeletedEventsAdmin } from "@/components/admin/deleted-events-admin";
import { type Metadata } from "next";
import {
    actionMigrate,
    actionLoadLegacy,
    actionStatus,
} from "@/components/admin/actions";

export const metadata: Metadata = {
    title: "Admin - Hirnstammtisch",
    description:
        "Hirnstammtisch is a local group of curious young people in the Bonn area meeting regularly in person for prepared talks on interesting topics. Administrative tools to manage users, migrations, and events.",
    openGraph: {
        title: "Admin - Hirnstammtisch",
        description:
            "Hirnstammtisch is a local group of curious young people in the Bonn area meeting regularly in person for prepared talks on interesting topics. Administrative tools to manage users, migrations, and events.",
    },
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
    alternates: { canonical: "/admin" },
};

async function deleteAllEvents() {
    "use server";

    const session = await getSession(await headers());
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.delete(event).where(sql`1=1`);
    revalidatePath("/admin");
}

async function migrateGideonEvents() {
    "use server";

    const session = await getSession(await headers());
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const now = new Date();
    const gideonOld = (usersJson as Array<{ id: number; name: string }>).find(
        (u) => u.name === "Gideon",
    );
    const gideonOldId = gideonOld?.id;
    if (!gideonOldId) throw new Error("Gideon not found in users.json");

    const eventsToInsert = (
        eventsJson as Array<{
            description: string;
            speaker: number;
            deleted: boolean;
            event_at: string | null;
            created_at: string | null;
            presentation_url: string | null;
        }>
    )
        .filter((e) => e.speaker === gideonOldId)
        .map((e) => ({
            title: e.description,
            speaker: session.user.id,
            slidesUrl:
                e.presentation_url && e.presentation_url.length > 0
                    ? e.presentation_url
                    : null,
            date: e.event_at ? new Date(e.event_at) : null,
            deleted: e.deleted,
            createdAt: e.created_at ? new Date(e.created_at) : now,
            updatedAt: now,
        }));

    if (eventsToInsert.length > 0) {
        await db.insert(event).values(eventsToInsert);
    }

    revalidatePath("/admin");
}

export default async function AdminPage() {
    const session = await getSession(await headers());

    if (!session?.user) {
        redirect("/signin");
    }

    if (session.user.role !== "admin") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-error text-2xl font-bold">
                        Access Denied
                    </h1>
                    <p className="text-text-muted mt-2">
                        You do not have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    const gideonOld = (usersJson as Array<{ id: number; name: string }>).find(
        (u) => u.name === "Gideon",
    );
    const totalGideonEvents = (eventsJson as Array<{ speaker: number }>).filter(
        (e) => e.speaker === (gideonOld?.id ?? -1),
    ).length;

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-8 text-3xl font-bold">Admin Panel</h1>

            <div className="space-y-6">
                <div className="border-border bg-surface rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">Users</h2>
                    <p className="text-text-muted mb-4">
                        Manage user roles and creation dates.
                    </p>
                    <UserAdmin
                        legacyUsers={(
                            usersJson as Array<{
                                id: number;
                                name: string;
                                created_at?: string | null;
                            }>
                        ).map((u) => ({
                            id: u.id,
                            name: u.name,
                            createdAt: u.created_at ?? undefined,
                        }))}
                        actionMigrate={actionMigrate}
                        actionLoadLegacy={actionLoadLegacy}
                        actionStatus={actionStatus}
                    />
                </div>

                <div className="border-border bg-surface rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Deleted Events
                    </h2>
                    <p className="text-text-muted mb-4">
                        Review events marked as deleted and permanently remove
                        if needed.
                    </p>
                    <DeletedEventsAdmin />
                </div>

                <div className="border-border bg-surface rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Delete All Events
                    </h2>
                    <p className="text-text-muted mb-4">
                        Permanently delete all events from the database. This
                        action cannot be undone.
                    </p>
                    <form action={deleteAllEvents}>
                        <Button type="submit" variant="destructive">
                            Delete All Events
                        </Button>
                    </form>
                </div>

                <div className="border-border bg-surface rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Event Migration
                    </h2>
                    <p className="text-text-muted mb-4">{`Migrate all ${totalGideonEvents} events where Gideon was the speaker (including deleted).`}</p>
                    <form action={migrateGideonEvents}>
                        <Button type="submit" variant="accent">
                            {"Migrate Gideon's Events"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
