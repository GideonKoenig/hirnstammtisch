"use client";

import { Separator } from "~/components/ui/separator";
import { type User } from "~/lib/data-types";
import Image from "next/image";
import EditableTextField from "~/components/editable-text-field";
import { removeProfileImage, updateUser } from "~/lib/server-actions";
import { UploadButton } from "~/lib/uploadthing";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserForm(props: { user: User }) {
    const router = useRouter();

    return (
        <div className="grid w-full max-w-xl grid-cols-2 items-center gap-2 gap-y-4 rounded-lg border border-menu-hover bg-menu-light p-2 py-4 shadow shadow-menu-dark">
            <div className="col-span-2 flex flex-col items-center gap-2 pb-4">
                {props.user.imageUrl ? (
                    <div className="relative h-[160px] w-[140px] md:h-[220px] md:w-[180px]">
                        <Image
                            src={props.user.imageUrl}
                            alt={props.user.name}
                            fill
                            className="rounded-lg object-cover shadow shadow-menu-dark"
                        />
                    </div>
                ) : (
                    <div className="flex h-[160px] w-[140px] items-center justify-center rounded-lg bg-menu-hover shadow shadow-menu-dark md:h-[220px] md:w-[180px]">
                        <p className="flex h-full w-full items-center justify-center text-[100px] text-text-muted">
                            ?
                        </p>
                    </div>
                )}

                <div className="flex h-8 w-[140px] flex-row items-center gap-1 md:w-[180px]">
                    <UploadButton
                        appearance={{
                            container:
                                "w-full h-full overflow-hidden rounded-lg text-xs",
                            button: "w-full h-full bg-accent/80 ut-ready:bg-accent/80 hover:bg-accent/60 ut-ready:hover:bg-accent/60",
                            allowedContent: "hidden",
                        }}
                        content={{
                            button: "Upload Image",
                        }}
                        endpoint="imageUploader"
                        onClientUploadComplete={() => {
                            router.refresh();
                        }}
                    />
                    <Button
                        variant="ghost"
                        className="aspect-square h-full p-1"
                        onMouseDown={() => {
                            void removeProfileImage(props.user);
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <p className="text-sm">Username:</p>
            <EditableTextField
                value={props.user.name}
                onChange={(newValue) => {
                    if (newValue.trim() === "") return;
                    if (newValue === props.user.name) return;

                    void updateUser(props.user.id, {
                        ...props.user,
                        name: newValue,
                    });
                }}
            />

            <Separator className="col-span-2 bg-menu-hover" />

            <p className="text-sm text-text-muted">User ID:</p>
            <p className="text-sm text-text-muted">{props.user.id}</p>

            <p className="text-sm text-text-muted">Account created at:</p>
            <p className="text-sm text-text-muted">
                {props.user.createdAt.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}
            </p>
        </div>
    );
}
