import { db } from "~/server/db";

export default async function About() {
    const userListRaw = await db.query.UserTable.findMany();
    const userList = userListRaw.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    return (
        <div>
            About
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
    );
    {
        /* <div className="col-span-1 grid grid-cols-[10rem_auto] gap-2 rounded-md border border-menu-light px-4 py-2">
                    <h2 className="col-span-2 text-2xl">Statistics</h2>

                    <p>Eventcount:</p>
                    <p>{events.length}</p>

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
                </div> */
    }
}
