"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/ui/input-text";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { api, type RouterOutputs } from "@/trpc/react";
import {
    Image as ImageIcon,
    Link as LinkIcon,
    Music2,
    Upload,
    Video,
    X,
    LoaderCircle,
    ExternalLink,
} from "lucide-react";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";

type Attachment = RouterOutputs["attachment"]["getAll"][number];
type AssetKind = Attachment["type"];

export function AssetUploader(props: { eventId?: string }) {
    const uploadsDisabled = !props.eventId;
    const [isUploading, setIsUploading] = useState(false);
    const utils = api.useUtils();
    const attachments = api.attachment.getAll.useQuery(
        { eventId: props.eventId ?? "" },
        { enabled: !!props.eventId },
    );
    const createLink = api.attachment.createLink.useMutation({
        onError: (error) =>
            toast.error("Failed to create link", {
                description: error.message,
            }),
    });

    const items = attachments.data ?? [];

    const invalidate = () => {
        if (!props.eventId) return;
        void utils.attachment.getAll.invalidate({ eventId: props.eventId });
    };

    const addLinkNow = async () => {
        if (!props.eventId) return;
        await createLink.mutateAsync({ eventId: props.eventId });
        invalidate();
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <UploadButton
                    disabled={uploadsDisabled || isUploading}
                    appearance={{
                        container: "",
                        button: "bg-bg hover:bg-bg/70 border border-border h-9 px-3 rounded-md text-sm inline-flex items-center",
                        allowedContent: "hidden",
                    }}
                    content={{
                        button: (
                            <>
                                {isUploading && (
                                    <div className="flex items-center gap-2">
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        Uploading...
                                    </div>
                                )}
                                {!isUploading && (
                                    <div className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Upload asset
                                    </div>
                                )}
                            </>
                        ),
                    }}
                    endpoint="eventAttachmentUploader"
                    input={{
                        eventId: props.eventId ?? "",
                    }}
                    onUploadBegin={() => setIsUploading(true)}
                    onUploadError={(error) => {
                        toast.error("Failed to upload asset", {
                            description: error.message,
                        });
                        setIsUploading(false);
                    }}
                    onClientUploadComplete={() => {
                        invalidate();
                        toast.success("Asset uploaded successfully");
                        setIsUploading(false);
                    }}
                />
                <Button
                    variant="outline"
                    disabled={uploadsDisabled}
                    onMouseDown={addLinkNow}
                >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Add link
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                {items.map((assetItem) => (
                    <AttachmentRow
                        key={assetItem.id}
                        item={assetItem}
                        eventId={props.eventId}
                    />
                ))}
                {items.length === 0 && (
                    <div className="text-text-muted text-sm">
                        No attachments yet
                    </div>
                )}
            </div>
        </div>
    );
}

function KindIcon(props: { kind: AssetKind }) {
    if (props.kind === "audio") return <Music2 className="mr-2 h-4 w-4" />;
    if (props.kind === "video") return <Video className="mr-2 h-4 w-4" />;
    if (props.kind === "image") return <ImageIcon className="mr-2 h-4 w-4" />;
    return <LinkIcon className="mr-2 h-4 w-4" />;
}

function AttachmentRow(props: { item: Attachment; eventId?: string }) {
    const utils = api.useUtils();
    const [isDeleting, setIsDeleting] = useState(false);
    const updateAttachment = api.attachment.update.useMutation({
        onError: (error) =>
            toast.error("Failed to update attachment", {
                description: error.message,
            }),
    });
    const deleteAttachment = api.attachment.delete.useMutation({
        onError: (error) =>
            toast.error("Failed to delete attachment", {
                description: error.message,
            }),
    });

    const invalidate = () => {
        if (!props.eventId) return;
        void utils.attachment.getAll.invalidate({ eventId: props.eventId });
    };

    return (
        <div
            className={cn(
                `border-border bg-bg/40 grid items-center gap-2 rounded-md border px-3 py-2`,
                props.item.type === "link" &&
                    "grid-cols-[auto_1fr_1fr_auto_auto]",
                props.item.type !== "link" && "grid-cols-[auto_1fr_auto_auto]",
            )}
        >
            <KindIcon kind={props.item.type} />
            <InputText
                value={props.item.name}
                onSave={async (value) => {
                    const res = await tryCatch(
                        updateAttachment.mutateAsync({
                            id: props.item.id,
                            name: value,
                        }),
                    );
                    if (!res.success)
                        toast.error("Failed to update attachment", {
                            description: res.error.message,
                        });
                    invalidate();
                }}
                className="min-w-0"
                disabled={updateAttachment.isPending}
            />
            {props.item.type === "link" && (
                <InputText
                    value={props.item.url.value}
                    onSave={async (value) => {
                        const res = await tryCatch(
                            updateAttachment.mutateAsync({
                                id: props.item.id,
                                url: value,
                            }),
                        );
                        if (!res.success)
                            toast.error("Failed to update attachment", {
                                description: res.error.message,
                            });
                        invalidate();
                    }}
                    placeholder="https://..."
                    className="w-full min-w-0"
                />
            )}

            <a
                href={props.item.url.value}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-border inline-flex h-8 w-8 items-center justify-center rounded-md"
            >
                <ExternalLink className="h-4 w-4" />
            </a>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isDeleting}
                onMouseDown={async () => {
                    setIsDeleting(true);
                    const res = await tryCatch(
                        deleteAttachment.mutateAsync({ id: props.item.id }),
                    );
                    if (!res.success)
                        toast.error("Failed to delete attachment", {
                            description: res.error.message,
                        });
                    invalidate();
                    setIsDeleting(false);
                }}
            >
                {isDeleting && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {!isDeleting && <X className="h-4 w-4" />}
            </Button>
        </div>
    );
}
