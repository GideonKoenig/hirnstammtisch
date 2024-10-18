import { NavigationBar } from "~/components/ui/navigation-menu";

export default function HomePage() {
    return (
        <div>
            <NavigationBar />
            <main className="m-auto flex max-w-[1000px] flex-col gap-8 p-4">
                <h1 className="text-4xl font-bold">Welcome</h1>
                <p className="whitespace-pre-wrap">
                    {
                        "Welcome to HirnStammtisch, a small and lively gathering of curious minds in Bonn! Our aim is to create a casual, open platform where people can share their passions, explore new ideas, and dive into topics they’ve always wanted to discuss — or never thought about before. Whether you’re here to present your own interests or simply listen, we provide an informal space to connect and learn."
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
            </main>
        </div>
    );
}
