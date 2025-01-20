"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { addUser } from "~/user/db";

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
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <div className="flex flex-col gap-4 rounded-lg bg-menu-light p-4">
                <p className="w-full text-center text-2xl font-bold">Login</p>
                <p className="pr-28">To continue please tell us your name.</p>
                <form className="flex flex-col gap-2" onSubmit={saveName}>
                    <input
                        name="name"
                        className="w-full rounded border border-menu-light bg-menu-dark p-2 px-4 shadow shadow-menu-dark placeholder:text-text-muted focus-visible:outline-none"
                        type="text"
                        placeholder="Your Name"
                    />
                    <button
                        disabled={loading}
                        className="flex w-full flex-row items-center justify-center gap-1 rounded-lg bg-accent-main p-1 shadow shadow-menu-dark hover:bg-accent-dark hover:text-text-muted disabled:bg-accent-dark disabled:text-text-muted"
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
