"use client";

import Link from "next/link";
import { useState } from "react";
import { readCookie } from "../../utils";

export default function EditableTextFieldClient(props: {
    cookieName: string;
    content: string | undefined;
}) {
    const [content, setContent] = useState<string | undefined>(
        props.content ?? readCookie(props.cookieName),
    );

    if (!content)
        return (
            <Link className="flex h-12 items-center rounded px-4 hover:bg-menu-hover" href="/login">
                <p>Login</p>
            </Link>
        );

    return (
        <div className="relative w-auto">
            <p
                data-state={content === "" ? "placeholder" : "name"}
                className="p-2 text-text-normal data-[state=placeholder]:text-text-muted"
            >
                {content ?? "Please enter your Name"}
            </p>
            <input
                type="text"
                value={content}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setContent(event.target.value);
                    document.cookie = `username=${event.target.value}`;
                }}
                placeholder="Please enter your Name"
                className="absolute left-0 top-0 z-10 w-full bg-transparent p-2 text-transparent caret-text-normal focus-visible:outline-none"
            />
        </div>
    );
}
