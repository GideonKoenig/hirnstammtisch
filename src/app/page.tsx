import { asc, desc, lt, gt, sql } from "drizzle-orm";
import { NavigationBar } from "~/components/ui/navigation-menu";
import { db } from "~/server/db";
import { TopicsTable } from "~/server/db/schema";

export default async function HomePage() {
    const userList = (await db.query.UserTable.findMany()).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    const nextEvent = (
        await db
            .select()
            .from(TopicsTable)
            .where(gt(TopicsTable.eventAt, new Date()))
            .orderBy(asc(TopicsTable.eventAt))
            .limit(1)
    )[0]!;

    const lastEvent = (
        await db
            .select()
            .from(TopicsTable)
            .where(lt(TopicsTable.eventAt, new Date()))
            .orderBy(desc(TopicsTable.eventAt))
            .limit(1)
    )[0]!;

    const pastEventCount = await db
        .select({
            count: sql`COUNT(*)`,
        })
        .from(TopicsTable)
        .where(lt(TopicsTable.eventAt, new Date()));

    return (
        <div className="flex h-screen w-screen flex-col">
            <NavigationBar />
            <main className="m-auto flex max-w-[1000px] flex-grow flex-col gap-8 p-4">
                <h1 className="text-4xl font-bold">Welcome</h1>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-8">
                        <p className="whitespace-pre-wrap">
                            {
                                "Welcome to the HirnstammTisch, a small and lively gathering of curious minds in Bonn! Our aim is to create a casual, open platform where people can share their passions, explore new ideas, and dive into topics they’ve always wanted to discuss — or never thought about before. Whether you’re here to present your own interests or simply listen, we provide an informal space to connect and learn."
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
                    <div className="flex flex-col gap-4">
                        <div className="col-span-1 grid grid-cols-[10rem_auto] gap-2 rounded-md border border-menu-light px-4 py-2">
                            <h2 className="col-span-2 pb-4 text-2xl">
                                Next Event
                            </h2>
                            <p>Topic:</p>
                            <p>{nextEvent.description}</p>

                            <p>Date:</p>
                            <p>
                                {nextEvent.eventAt?.toLocaleDateString(
                                    "de-DE",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    },
                                )}
                            </p>

                            <p>Speaker:</p>
                            <p>{nextEvent.speaker}</p>
                        </div>
                        <div className="col-span-1 grid grid-cols-[10rem_auto] gap-2 rounded-md border border-menu-light px-4 py-2">
                            <h2 className="col-span-2 text-2xl">Last Event</h2>

                            <p>Topic:</p>
                            <p>{lastEvent.description}</p>

                            <p>Date:</p>
                            <p>
                                {lastEvent.eventAt?.toLocaleDateString(
                                    "de-DE",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    },
                                )}
                            </p>

                            <p>Speaker:</p>
                            <p>{lastEvent.speaker}</p>

                            <p>Presentation:</p>
                            <a
                                data-state={!!lastEvent.presentationUrl}
                                href={lastEvent.presentationUrl ?? ""}
                                className="hidden underline data-[state=true]:block"
                            >
                                <p>
                                    {lastEvent.presentationUrl?.slice(0, 25) +
                                        "..."}
                                </p>
                            </a>
                        </div>
                        <div className="col-span-1 grid grid-cols-[10rem_auto] gap-2 rounded-md border border-menu-light px-4 py-2">
                            <h2 className="col-span-2 text-2xl">Statistics</h2>

                            <p>Eventcount:</p>
                            <p>{pastEventCount[0]!.count as number}</p>

                            <p>Members:</p>
                            <div className="grid w-full grid-cols-3 gap-2">
                                {userList.map((user, index) => (
                                    <p
                                        key={index}
                                        className="rounded bg-menu-light text-center"
                                    >
                                        {user.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
