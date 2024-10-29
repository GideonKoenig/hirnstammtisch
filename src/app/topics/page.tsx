import { NavigationBar } from "~/components/ui/navigation-menu";
import TopicsForm from "~/components/topics/form";
import { TopicList } from "~/components/topics/list";
import { db } from "~/server/db";
import { readCookie } from "~/server/utils";
import { not } from "drizzle-orm";
import { type Topic } from "~/components/topics/types";
import { TopicsTable } from "~/server/db/schema";

export default async function TopicPage() {
    const topics = (
        await db.query.TopicsTable.findMany({
            where: not(TopicsTable.deleted),
        })
    ).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    ) as unknown as Topic[];

    const userList = await db.query.UserTable.findMany();
    userList.push({
        id: -1,
        name: "Anyone",
        createdAt: new Date(0),
    });
    const users = userList.sort((a, b) => a.id - b.id).map((user) => user.name);
    const userName = readCookie("username");

    return (
        <div>
            <NavigationBar />
            <div className="m-auto flex w-full max-w-[1000px] flex-col gap-8 p-6 pb-0">
                <h1 className="text-4xl font-bold">Topics</h1>
                <p className="whitespace-pre">
                    {
                        "Feel free to leave suggestions for topics that you want to talk or hear about.\nIf you want to schedule a specific topic, go to the Events page.\nYou can edit the description of a topic by just clicking on it."
                    }
                </p>

                <TopicsForm user={users} userName={userName} />

                <TopicList topics={topics} users={users} />
            </div>
        </div>
    );
}
