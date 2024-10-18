import { lt, sql } from "drizzle-orm";
import { NavigationBar } from "~/components/ui/navigation-menu";
import { db } from "~/server/db";
import { TopicsTable } from "~/server/db/schema";

export default async function HomePage() {
    const userList = (await db.query.UserTable.findMany()).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    const firstTopic = (
        await db.select().from(TopicsTable).orderBy(TopicsTable.eventAt).limit(1)
    )[0];
    const pastEventCount = await db
        .select({
            count: sql`COUNT(*)`,
        })
        .from(TopicsTable)
        .where(lt(TopicsTable.eventAt, new Date()))
        .execute();

    return (
        <div className="flex h-screen w-screen flex-col">
            <NavigationBar />
            <main className="m-auto flex max-w-[1000px] flex-grow flex-col gap-8 p-4">
                <h1 className="text-4xl font-bold">Welcome</h1>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 flex flex-col gap-8">
                        <p className="whitespace-pre-wrap">
                            {
                                "Welcome to the HirnStammtisch, a small and lively gathering of curious minds in Bonn! Our aim is to create a casual, open platform where people can share their passions, explore new ideas, and dive into topics they’ve always wanted to discuss — or never thought about before. Whether you’re here to present your own interests or simply listen, we provide an informal space to connect and learn."
                            }
                        </p>
                        <p className="whitespace-pre-wrap">
                            {
                                "We meet every Tuesday at 19:00, keeping the main session to just one hour. The goal is to encourage engaging, thought-provoking conversations that spark curiosity and broaden horizons. Think of us as a local, more relaxed version of TED Talks, where every topic is welcome."
                            }
                        </p>
                        <p className="whitespace-pre-wrap">
                            {
                                "Want to suggest a topic or speaker? Head over to the Topics Page and share your ideas! Don’t forget to check out the Events Page for a list of past and upcoming gatherings, where you can see what we’ve discussed and what’s on the horizon."
                            }
                        </p>
                    </div>
                    <div className="col-span-1 rounded-md border border-menu-light p-4">
                        <div className="grid grid-cols-2 gap-2">
                            <h2 className="col-span-2 text-2xl">Statistics</h2>

                            <p>First Event:</p>
                            <p>
                                {firstTopic?.eventAt?.toLocaleDateString("de-DE", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>
                            <p>Past Events:</p>
                            <p>{pastEventCount[0]!.count as number}</p>
                            <p>Members:</p>
                            <div>
                                {userList.map((user) => (
                                    <p>{user.name}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
