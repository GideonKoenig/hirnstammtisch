"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const saveName = (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);
        const username = formData.get("name") as string;

        document.cookie = `username=${username}`;
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
                        className="bg-accent-main disabled:bg-accent-dark w-full rounded-lg p-1 disabled:text-text-muted"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
