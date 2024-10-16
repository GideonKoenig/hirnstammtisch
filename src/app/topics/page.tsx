import { NavigationBar } from "~/components/navigation-menu";

export default function Topics() {
    return (
        <div>
            <NavigationBar />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-4xl font-bold">Topics</h1>
                <p>
                    Feel free to leave suggestions for topics that you want to talk or hear about.
                </p>
                <div></div>
            </div>
        </div>
    );
}
