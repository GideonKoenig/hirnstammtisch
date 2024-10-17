"use client";

import { useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { ComboBox } from "~/components/ui/combobox";
import { readCookie } from "~/components/utils";
import { addTopic } from "~/components/topics/db";

export default function TopicsForm(props: { user: string[]; userName: string | undefined }) {
    const user = readCookie("username")!;
    const [forUser, setForUser] = useState<string>(props.userName ?? user);
    const [description, setDescription] = useState<string | undefined>(undefined);
    const queryClient = useQueryClient();

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const description = formData.get("description") as string;

        setDescription("");
        await addTopic({
            description,
            for: forUser,
            from: user,
        });
        await queryClient.invalidateQueries({
            queryKey: ["topics"],
            exact: true,
        });
    };

    return (
        <form onSubmit={submit}>
            <div className="grid grid-cols-[auto_300px_100px] items-center gap-x-2 gap-y-1">
                <p className="pl-1 text-sm text-text-muted">Description</p>
                <p className="pl-1 text-sm text-text-muted">Proposed Speaker:</p>
                <div className="" />

                <input
                    type="text"
                    name="description"
                    value={description}
                    className="rounded border-menu-light bg-menu-dark p-2 text-text-normal shadow shadow-menu-dark placeholder:text-text-muted focus-visible:outline-none"
                    placeholder="Your topic..."
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setDescription(event.target.value)
                    }
                />

                <ComboBox
                    className="z-10"
                    state={forUser}
                    setState={setForUser}
                    options={props.user}
                />

                <button
                    disabled={!description}
                    className="rounded-lg border-menu-light bg-accent-main p-[0.375rem] shadow shadow-menu-dark hover:bg-accent-dark hover:text-text-muted disabled:cursor-not-allowed disabled:bg-accent-dark disabled:text-text-muted"
                >
                    Add
                </button>
            </div>
        </form>
    );
}
