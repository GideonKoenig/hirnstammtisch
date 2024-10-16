import { NavigationBar } from "~/components/navigation-menu";

export default function HomePage() {
    return (
        <div>
            <NavigationBar />
            <main className="flex flex-col gap-2 p-4">
                <h1 className="text-xl font-bold">Das ist der Hirnstammtisch</h1>
                <p className="flex flex-row gap-4">
                    <span>15.10.2024</span> <span>How does the Internet work?</span>
                </p>
            </main>
        </div>
    );
}
