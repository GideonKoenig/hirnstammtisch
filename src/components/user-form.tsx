"use client";

import { Separator } from "~/components/ui/separator";
import { type User } from "~/lib/data-types";
import Image from "next/image";
import EditableTextField from "~/components/ui/editable-text-field";
import { removeProfileImage, updateUser } from "~/lib/server-actions";
import { UploadButton } from "~/lib/uploadthing";
import { Button } from "~/components/ui/button";
import { Download, LoaderCircle, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePwa } from "~/components/pwa-provider";
import { useState } from "react";
import { useData } from "~/components/data-provider";

export default function UserForm(props: { user: User }) {
    const router = useRouter();
    const { setActiveUser } = useData();
    const { isOffline, installPrompt, isInstallable } = usePwa();
    const [loading, setLoading] = useState(false);

    return (
        <div className="border-menu-hover bg-menu-light shadow-menu-dark grid w-full max-w-xl grid-cols-2 items-center gap-2 gap-y-4 rounded-lg border p-2 py-4 shadow-sm">
            <div className="relative col-span-2 flex flex-col items-center gap-2 pb-4">
                <div className="absolute top-0 right-0 flex flex-col items-start gap-2">
                    <button
                        className="hover:bg-menu-hover flex w-full flex-row items-center gap-1 rounded-md bg-transparent p-2 text-sm"
                        onMouseDown={() => {
                            setActiveUser(undefined);
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>

                    <button
                        data-show={isInstallable}
                        className="hover:bg-menu-hover hidden w-full flex-row items-center gap-1 rounded-md bg-transparent p-2 text-sm data-[show=true]:flex"
                        onMouseDown={async () => {
                            await installPrompt();
                        }}
                    >
                        <Download className="h-4 w-4" />
                        Install App
                    </button>
                </div>

                {props.user.imageUrl ? (
                    <div className="relative h-[160px] w-[140px] md:h-[220px] md:w-[180px]">
                        <Image
                            src={props.user.imageUrl}
                            alt={props.user.name}
                            fill
                            sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px"
                            className="shadow-menu-dark rounded-lg object-cover shadow-sm"
                        />
                    </div>
                ) : (
                    <div className="bg-menu-hover shadow-menu-dark flex h-[160px] w-[140px] items-center justify-center rounded-lg shadow-sm md:h-[220px] md:w-[180px]">
                        <p className="text-text-muted flex h-full w-full items-center justify-center text-[100px]">
                            ?
                        </p>
                    </div>
                )}

                <div className="flex h-8 w-[140px] flex-row items-center gap-1 md:w-[180px]">
                    <UploadButton
                        disabled={isOffline}
                        appearance={{
                            container:
                                "w-full h-full overflow-hidden rounded-lg text-xs",
                            button: "w-full h-full bg-accent/80 ut-ready:bg-accent/80 hover:bg-accent/60 ut-ready:hover:bg-accent/60 ut-readying:bg-accent/60  ut-uploading:bg-accent/40 ut-uploading:cursor-not-allowed after:bg-accent/80 data-[state=disabled]:bg-accent/60 data-[state=disabled]:cursor-not-allowed",
                            allowedContent: "hidden",
                        }}
                        content={{
                            button: "Upload Image",
                        }}
                        endpoint="imageUploader"
                        onUploadBegin={() => {
                            setLoading(true);
                        }}
                        onClientUploadComplete={() => {
                            router.refresh();
                            setLoading(false);
                        }}
                    />
                    <Button
                        data-hide={!props.user.imageUrl}
                        variant="ghost"
                        disabled={isOffline}
                        className="aspect-square h-full p-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-transparent data-[hide=true]:hidden"
                        onMouseDown={async () => {
                            setLoading(true);
                            await removeProfileImage(props.user);
                            setLoading(false);
                        }}
                    >
                        <LoaderCircle
                            data-load={loading}
                            className="hidden h-4 w-4 animate-spin data-[show=load]:block"
                        />
                        <X
                            data-load={loading}
                            className="block h-4 w-4 data-[show=load]:hidden"
                        />
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

            <Separator className="bg-menu-hover col-span-2" />

            <p className="text-text-muted text-sm">User ID:</p>
            <p className="text-text-muted text-sm">{props.user.id}</p>

            <p className="text-text-muted text-sm">Account created at:</p>
            <p className="text-text-muted text-sm">
                {props.user.createdAt.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}
            </p>
        </div>
    );
}
