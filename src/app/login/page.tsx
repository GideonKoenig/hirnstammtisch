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

        await addUser(username.trim());
        document.cookie = `username=${username.trim()}`;
        router.push("/");
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-2">
            <div className="border-menu-hover bg-menu-light shadow-menu-dark flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
                <p className="w-full text-center text-2xl font-bold">Login</p>
                <p className="pr-28">To continue please tell us your name.</p>
                <form className="flex flex-col gap-4" onSubmit={saveName}>
                    <input
                        name="name"
                        className="border-menu-light bg-menu-dark shadow-menu-dark placeholder:text-text-muted w-full rounded-md border p-2 px-4 shadow-sm focus-visible:outline-hidden"
                        type="text"
                        placeholder="Your Name"
                    />
                    <button
                        disabled={loading}
                        className="hover:bg-accent-dark disabled:bg-accent-dark shadow-menu-dark hover:text-text-muted disabled:text-text-muted flex w-full flex-row items-center justify-center gap-1 rounded-lg bg-blue-500 p-1 shadow-sm hover:bg-blue-500/80 disabled:bg-blue-500/80"
                        type="submit"
                    >
                        <LoaderCircle
                            data-state={loading ? "show" : "hide"}
                            className="stroke-text-muted h-4 w-4 animate-spin stroke-2 data-[state=hide]:hidden"
                        />
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
