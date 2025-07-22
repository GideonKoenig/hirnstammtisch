import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/server/utils";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { event } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

async function deleteAllEvents() {
    "use server";

    const session = await getSession(await headers());
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.delete(event);
    revalidatePath("/admin");
}

async function migrateGideonEvents() {
    "use server";

    const session = await getSession(await headers());
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const userId = "7RxOwN6rqth263vwKNVQS139skEvRUDL";
    const now = new Date();

    const eventsToMigrate = [
        {
            title: "How do websites and the internet work?",
            speaker: userId,
            slidesUrl:
                "https://docs.google.com/presentation/d/1b1pQ7orNBkmAVBS90E_hfaBDrREh-5wlOTdO-cSXHR0/edit?usp=sharing",
            date: new Date("2024-10-22T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2024-10-08T20:16:53.806Z"),
            updatedAt: now,
        },
        {
            title: "Modern Trust: The what how and why of money politics.",
            speaker: userId,
            slidesUrl:
                "https://docs.google.com/presentation/d/17DjqcgSkr5RDRDPydpHymnOFSFF3D2o0ZYDTHdEgJcA/edit?usp=sharing",
            date: new Date("2024-12-03T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2024-12-04T07:08:25.55Z"),
            updatedAt: now,
        },
        {
            title: "Modern Trust: Why debt is good.",
            speaker: userId,
            slidesUrl:
                "https://docs.google.com/presentation/d/1q5IDvq6e3LJavmh3gXV858kzOljqWLEJwXO2ACVFpMY/edit?usp=sharing",
            date: new Date("2025-02-04T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-01-24T21:26:01.214Z"),
            updatedAt: now,
        },
        {
            title: "Why there is no unhealthy food.",
            speaker: userId,
            slidesUrl:
                "https://docs.google.com/presentation/d/1G1CO4HoPdt87uJBH9VnFUOq-lTYn69jQKT1pl7RQidw/edit?usp=sharing",
            date: new Date("2025-03-11T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-01-12T15:18:58.016Z"),
            updatedAt: now,
        },
        {
            title: "Manly man stuff.",
            speaker: userId,
            slidesUrl:
                "https://docs.google.com/presentation/d/1G1CO4HoPdt87uJBH9VnFUOq-lTYn69jQKT1pl7RQidw/edit?usp=sharing",
            date: new Date("2025-03-25T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-03-18T21:27:02.165Z"),
            updatedAt: now,
        },
        {
            title: "What do Belle Delphine and Martin Luther have in common?",
            speaker: userId,
            slidesUrl:
                "https://docs.google.com/presentation/d/14o0r--R3JIPpUw6uAT2MA8a6ZQ9Ak-3csnC2K9-unag/edit?usp=sharing",
            date: new Date("2025-05-12T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-02-06T16:31:55.742Z"),
            updatedAt: now,
        },
        {
            title: "The history of earth, life and humans.",

            speaker: userId,
            slidesUrl:
                "https://docs.google.com/presentation/d/1RZ4IP_2amBZRJMK2V5VUzJeNHRuad-Yj1_dTJ660-IY/edit?usp=sharing",
            date: new Date("2025-05-26T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-04-22T11:02:41.175Z"),
            updatedAt: now,
        },
        {
            title: "How does a car engine work?",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-07-08T17:00:00Z"),
            deleted: false,
            createdAt: new Date("2024-12-31T11:48:00.004Z"),
            updatedAt: now,
        },
        {
            title: "The real reasons to dislike Trump.",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-01-20T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-01-04T01:17:56.194Z"),
            updatedAt: now,
        },
        {
            title: "Why you don't have to feel bad for breathing.",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-06-16T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-06-03T19:23:03.612Z"),
            updatedAt: now,
        },
        {
            title: "What kinds of beer are there and how are they made?",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-08-10T17:00:00Z"),
            deleted: false,
            createdAt: new Date("2024-10-08T20:19:53.806Z"),
            updatedAt: now,
        },
        {
            title: "How do I get from 0s and 1s to a picture on my screen?",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-09-15T17:00:00Z"),
            deleted: false,
            createdAt: new Date("2024-10-08T20:18:53.806Z"),
            updatedAt: now,
        },
        {
            title: "The history of religions.",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-10-06T17:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-06-01T19:34:54.657Z"),
            updatedAt: now,
        },
        {
            title: "Datenschutz uund Ã¤h  Ã¤nd-tsu-Ã¤nd VerschlÃ¼sselung",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-11-10T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-06-24T20:11:23.102Z"),
            updatedAt: now,
        },
        {
            title: "One small step.",

            speaker: userId,
            slidesUrl: null,
            date: new Date("2025-12-01T18:00:00Z"),
            deleted: false,
            createdAt: new Date("2025-06-20T13:28:34.472Z"),
            updatedAt: now,
        },
    ];

    for (const eventData of eventsToMigrate) {
        await db.insert(event).values(eventData);
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
                    <h1 className="text-2xl font-bold text-red-600">
                        Access Denied
                    </h1>
                    <p className="mt-2 text-gray-600">
                        You do not have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-8 text-3xl font-bold">Admin Panel</h1>

            <div className="space-y-6">
                <div className="rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Delete All Events
                    </h2>
                    <p className="mb-4 text-gray-600">
                        Permanently delete all events from the database. This
                        action cannot be undone.
                    </p>
                    <form action={deleteAllEvents}>
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete All Events
                        </Button>
                    </form>
                </div>

                <div className="rounded-lg border p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Event Migration
                    </h2>
                    <p className="mb-4 text-gray-600">
                        Migrate all 15 events where Gideon was the speaker
                        (excluding deleted ones).
                    </p>
                    <form action={migrateGideonEvents}>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Migrate Gideon's Events
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
