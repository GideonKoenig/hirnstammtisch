"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { cn, debounce, readCookie } from "~/lib/utils";

export default function EditableTextFieldClient(props: {
    className?: string;
    cookieName?: string;
    initialContent?: string;
    callback: (oldValue: string, newValue: string) => Promise<void>;
    fallback?: ReactNode;
}) {
    const [content, setContent] = useState<string>(() => {
        if (props.initialContent) return props.initialContent;
        if (!props.cookieName) return "";

        const cookieValue = readCookie(props.cookieName);
        if (cookieValue) return cookieValue;
        return "";
    });
    const router = useRouter();
    const previousUserNameRef = useRef(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateUserDebounced = useCallback(
        debounce((oldValue: string | undefined, newValue: string) => {
            if (!oldValue) return;
            previousUserNameRef.current = newValue;
            void props.callback(oldValue, newValue).then(() => {
                router.refresh();
            });
        }, 500),
        [],
    );

    if (!content) return props.fallback;

    return (
        <div className={cn("relative w-auto", props.className, "p-0")}>
            <p
                data-state={content === "" ? "placeholder" : "name"}
                className="max-w-full text-text-normal data-[state=placeholder]:text-text-muted"
            >
                {content ?? "Please enter your Name"}
            </p>
            <input
                type="text"
                value={content}
                onChange={async (
                    event: React.ChangeEvent<HTMLInputElement>,
                ) => {
                    setContent(event.target.value);
                    if (props.cookieName)
                        document.cookie = `${props.cookieName}=${event.target.value}`;
                    updateUserDebounced(
                        previousUserNameRef.current,
                        event.target.value,
                    );
                }}
                className="absolute left-0 top-0 z-10 w-full bg-transparent text-transparent caret-text-normal focus-visible:outline-none"
            />
        </div>
    );
}
