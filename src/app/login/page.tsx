"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { addUser } from "~/lib/server-actions";

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const saveName = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);
        const username = formData.get("name") as string;
        if (username.trim() === "") {
            setLoading(false);
            return;
        }

        document.cookie = `username=${username.trim()}`;
        await addUser(username.trim());
        router.push("/");
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center p-2">
            <div className="flex flex-col gap-4 rounded-lg border border-menu-hover bg-menu-light p-4 shadow shadow-menu-dark">
                <p className="w-full text-center text-2xl font-bold">Login</p>
                <p className="pr-28">To continue please tell us your name.</p>
                <form className="flex flex-col gap-4" onSubmit={saveName}>
                    <input
                        name="name"
                        className="w-full rounded-md border border-menu-light bg-menu-dark p-2 px-4 shadow shadow-menu-dark placeholder:text-text-muted focus-visible:outline-none"
                        type="text"
                        placeholder="Your Name"
                    />
                    <button
                        disabled={loading}
                        className="hover:bg-accent-dark disabled:bg-accent-dark flex w-full flex-row items-center justify-center gap-1 rounded-lg bg-blue-500 p-1 shadow shadow-menu-dark hover:bg-blue-500/80 hover:text-text-muted disabled:bg-blue-500/80 disabled:text-text-muted"
                        type="submit"
                    >
                        <LoaderCircle
                            data-state={loading ? "show" : "hide"}
                            className="h-4 w-4 animate-spin stroke-text-muted stroke-2 data-[state=hide]:hidden"
                        />
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
