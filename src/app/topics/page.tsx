import { NavigationBar } from "~/components/navigation-menu";
import TopicsForm from "~/components/topics/form";
import { TopicList } from "~/components/topics/list";
import { db } from "~/server/db";
import { readCookie } from "~/server/utils";

export default async function TopicPage() {
    const userList = await db.query.user.findMany();
    userList.push({
        id: -1,
        name: "Anyone",
        createdAt: new Date(0),
    });
    const userName = readCookie("username");

    return (
        <div>
            <NavigationBar />
            <div className="m-auto flex max-w-[1200px] flex-col gap-6 p-6">
                <h1 className="text-4xl font-bold">Topics</h1>
                <p className="whitespace-pre">
                    {
                        "Feel free to leave suggestions for topics that you want to talk or hear about.\nRemeber to mark a topic as done, once it has been used."
                    }
                </p>

                <TopicsForm
                    user={userList.sort((a, b) => a.id - b.id).map((user) => user.name)}
                    userName={userName}
                />

                <TopicList />
            </div>
        </div>
    );
}
