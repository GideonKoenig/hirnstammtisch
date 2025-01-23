"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { ComboBox } from "~/components/ui/combobox";
import { readCookie } from "~/components/utils";
import { addTopic } from "~/components/topics/db";
import { useRouter } from "next/navigation";

export default function TopicsForm(props: {
    user: string[];
    userName: string | undefined;
}) {
    const user = readCookie("username")!;
    const [speaker, setSpeaker] = useState<string>(props.userName ?? user);
    const [description, setDescription] = useState<string | undefined>(
        undefined,
    );
    const router = useRouter();

    useEffect(() => {
        if (!props.user.includes(speaker)) setSpeaker(props.userName ?? user);
    }, [props.user, props.userName, speaker, user]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const description = formData.get("description") as string;

        setDescription("");
        await addTopic({
            description,
            speaker: speaker,
            suggestedBy: user,
            deleted: false,
        });
        router.refresh();
    };

    return (
        <form onSubmit={submit}>
            <div className="grid grid-cols-[auto_250px_100px] items-center gap-x-2 gap-y-1">
                <p className="pl-1 text-sm text-text-muted">Title:</p>
                <p className="pl-1 text-sm text-text-muted">
                    Proposed Speaker:
                </p>
                <div className="" />

                <input
                    type="text"
                    name="description"
                    value={description}
                    className="rounded border-menu-light bg-menu-dark p-2 px-3 text-text-normal shadow shadow-menu-dark placeholder:text-text-muted focus-visible:outline-none"
                    placeholder="Your topic..."
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setDescription(event.target.value)
                    }
                />

                {/* <ComboBox
                    className="z-10 w-[250px]"
                    initialValue={speaker}
                    setState={setSpeaker}
                    options={props.user}
                /> */}

                <button
                    disabled={!description}
                    className="bg-accent-main hover:bg-accent-dark disabled:bg-accent-dark rounded-lg border-menu-light p-[0.375rem] shadow shadow-menu-dark hover:text-text-muted disabled:cursor-not-allowed disabled:text-text-muted"
                >
                    Add
                </button>
            </div>
        </form>
    );
}
