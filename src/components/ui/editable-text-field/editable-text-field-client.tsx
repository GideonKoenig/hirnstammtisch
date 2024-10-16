"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { debounce, readCookie } from "src/components/utils";
import { updateUser } from "~/user/db";

export default function EditableTextFieldClient(props: {
    cookieName: string;
    content: string | undefined;
}) {
    const [userName, setContent] = useState<string | undefined>(
        props.content ?? readCookie(props.cookieName),
    );
    const previousUserNameRef = useRef(userName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateUserDebounced = useCallback(
        debounce((oldName: string | undefined, newName: string) => {
            if (!oldName) return;
            void updateUser(oldName, newName);
            previousUserNameRef.current = newName;
        }, 500),
        [],
    );

    if (!userName)
        return (
            <Link className="flex h-12 items-center rounded px-4 hover:bg-menu-hover" href="/login">
                <p>Login</p>
            </Link>
        );

    return (
        <div className="relative w-auto">
            <p
                data-state={userName === "" ? "placeholder" : "name"}
                className="p-2 text-text-normal data-[state=placeholder]:text-text-muted"
            >
                {userName ?? "Please enter your Name"}
            </p>
            <input
                type="text"
                value={userName}
                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    setContent(event.target.value);
                    document.cookie = `username=${event.target.value}`;
                    updateUserDebounced(previousUserNameRef.current, event.target.value);
                }}
                placeholder="Please enter your Name"
                className="absolute left-0 top-0 z-10 w-full bg-transparent p-2 text-transparent caret-text-normal focus-visible:outline-none"
            />
        </div>
    );
}
