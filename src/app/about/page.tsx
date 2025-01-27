import { ScrollArea } from "~/components/ui/scroll-area";
import { UserList } from "~/components/user-list";

export default async function About() {
    return (
        <ScrollArea className="h-full w-full">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4 p-4">
                <p className="text-2xl font-bold">About</p>
                <p>
                    The HirnstammTisch is a small group of people who meet
                    regularly to discuss interesting topics. We meet every
                    Tuesday at 19:00 at Gideon&apos;s place.
                </p>

                <div className="h-4" />

                <p className="pb-2 text-2xl font-bold">Members</p>

                <UserList />
            </div>
        </ScrollArea>
    );
}
