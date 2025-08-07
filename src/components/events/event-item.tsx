"use client";

import { Button } from "@/components/ui/button";
import {
    Pencil,
    Trash,
    Calendar,
    ExternalLink,
    Video,
    FileText,
    Download,
    Lock,
    X,
} from "lucide-react";
import type { ClientEvent, ClientUser } from "@/lib/types";
import { formatDate, formatWeekDistance } from "@/lib/date";
import { api } from "@/trpc/react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { checkAccess } from "@/lib/permissions/utilts";
import { useUser } from "@/lib/use-user";

export function EventCard(props: {
    event: ClientEvent;
    showActions?: boolean;
    onEdit?: (event?: ClientEvent) => void;
}) {
    const utils = api.useUtils();
    const user = useUser();
    const { data: speaker } = api.user.getById.useQuery({
        id: props.event.speaker,
    });
    const deleteEvent = api.event.delete.useMutation({
        onSuccess: () => {
            void utils.event.getAll.invalidate();
        },
    });

    if (!speaker) return null;

    return (
        <div className="group border-border/80 bg-card/70 ring-border/50 hover:bg-card/80 relative transform-gpu rounded-xl border p-4 ring-1 backdrop-blur-md transition-transform duration-50 ease-out hover:scale-[1.008] hover:shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
            <span
                aria-hidden
                className="border-border/60 absolute -inset-px rounded-xl border"
            />
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(135deg,var(--color-accent),transparent_40%,var(--color-accent))] opacity-[0.06] transition-opacity group-hover:opacity-[0.12]"
            />
            <span
                aria-hidden
                className="pointer-events-none absolute -top-6 -right-8 h-24 w-32 rounded-full bg-[radial-gradient(closest-side,var(--color-accent)/18,transparent)] opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
            />
            <div className="relative mb-4 flex flex-row items-start will-change-transform">
                <div className="min-w-0 grow">
                    <h3 className="text-text mb-1 text-lg font-bold tracking-tight break-words md:text-xl">
                        {props.event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="text-accent h-4 w-4" />
                        <span className="text-text-muted font-medium">
                            {formatDate(props.event.date, true)}
                            {props.event.date &&
                                ` (${formatWeekDistance(props.event.date)})`}
                        </span>
                    </div>
                </div>

                {props.showActions && checkAccess(user?.role, "member") && (
                    <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <Button
                            variant="outline"
                            size="icon"
                            onMouseDown={() => props.onEdit?.(props.event)}
                            className="inline-flex md:hidden md:group-hover:inline-flex"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                                deleteEvent.mutate({ id: props.event.id })
                            }
                            className="inline-flex md:hidden md:group-hover:inline-flex"
                            disabled={deleteEvent.isPending}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SpeakerCard user={speaker} />
                <div className="flex items-center gap-2 md:justify-end">
                    <SlidesLinkCard event={props.event} />
                    <RecordingDownloadCard event={props.event} />
                </div>
            </div>
        </div>
    );
}

// TODO: the slides element is not a clickable link, when it exists, and the recording should show "no recording" even if it is redacted and only redacted if it exists but was redacted

function SpeakerCard(props: { user: ClientUser }) {
    return (
        <div className="flex items-center gap-3">
            <UserAvatar userId={props.user.id} className="h-10 w-10" />
            <div>
                <p className="text-text-muted text-xs font-medium">Speaker</p>
                <div className="text-text font-semibold">{props.user.name}</div>
            </div>
        </div>
    );
}

function SlidesLinkCard(props: { event: ClientEvent }) {
    const { value, redacted } = props.event.slidesUrl;

    const hasValue = !!value;
    const isRedacted = redacted;

    if (isRedacted) {
        return (
            <ResponsiveTooltip
                content={
                    <div className="p-4">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="bg-warning/20 flex h-10 w-10 items-center justify-center rounded-full">
                                <Lock className="text-warning h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-text font-semibold">
                                    Member Content
                                </h3>
                                <p className="text-text-muted text-sm">
                                    Slides are available to members
                                </p>
                            </div>
                        </div>
                        <p className="text-text-muted text-sm">
                            Become a member to access presentation slides and
                            other exclusive content.
                        </p>
                    </div>
                }
            >
                <div className="border-warning/30 bg-warning/10 text-warning hover:bg-warning/20 flex w-32 cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
                    <Lock className="h-4 w-4" />
                    <span>Slides</span>
                </div>
            </ResponsiveTooltip>
        );
    }

    if (!hasValue) {
        return (
            <div className="bg-bg-muted/50 text-text-muted flex w-32 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
                <X className="h-4 w-4" />
                <span>No Slides</span>
            </div>
        );
    }

    return (
        <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-success/10 text-success hover:bg-success/20 flex w-32 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
        >
            <FileText className="h-4 w-4" />
            <span>Slides</span>
            <ExternalLink className="h-3 w-3" />
        </a>
    );
}

function RecordingDownloadCard(props: { event: ClientEvent }) {
    const user = useUser();
    const userIsMember = checkAccess(user?.role, "member");
    const { value, redacted } = props.event.recording;
    const asset = api.asset.getRecording.useQuery(
        {
            id: value!,
        },
        { enabled: !!value && !redacted && userIsMember },
    );

    const hasValue = !!value;
    const isRedacted = redacted;

    if (isRedacted || !userIsMember) {
        return (
            <ResponsiveTooltip
                content={
                    <div className="p-4">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="bg-warning/20 flex h-10 w-10 items-center justify-center rounded-full">
                                <Lock className="text-warning h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-text font-semibold">
                                    Member Content
                                </h3>
                                <p className="text-text-muted text-sm">
                                    Recording is available to members
                                </p>
                            </div>
                        </div>
                        <p className="text-text-muted text-sm">
                            Become a member to access video recordings and other
                            exclusive content.
                        </p>
                    </div>
                }
            >
                <div className="border-warning/30 bg-warning/10 text-warning hover:bg-warning/20 flex w-32 cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
                    <Lock className="h-4 w-4" />
                    <span>Recording</span>
                </div>
            </ResponsiveTooltip>
        );
    }

    if (!hasValue) {
        return (
            <div className="bg-bg-muted/50 text-text-muted flex w-32 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
                <X className="h-4 w-4" />
                <span>No Recording</span>
            </div>
        );
    }

    if (asset.isLoading || !asset.data) {
        return (
            <div className="bg-bg-muted/50 text-text-muted flex w-32 animate-pulse items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
                <Video className="h-4 w-4" />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <a
            href={asset.data.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent-secondary/10 text-accent-secondary hover:bg-accent-secondary/20 flex w-32 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
        >
            <Video className="h-4 w-4" />
            <span>Recording</span>
            <Download className="h-3 w-3" />
        </a>
    );
}
