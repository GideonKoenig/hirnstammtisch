"use client";

import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { ComboBox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { useEvents } from "@/components/events/event-context";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Eye, Upload, X, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";

export function EventModal() {
    const { modalOpen, activeEvent, closeModal, setActiveEvent } = useEvents();
    const [notesVisible, setNotesVisible] = useState(false);
    const [selectedRecordingFile, setSelectedRecordingFile] =
        useState<File | null>(null);
    const [removeExistingRecording, setRemoveExistingRecording] =
        useState(false);
    const initialRecordingIdRef = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { startUpload, isUploading } = useUploadThing("videoAudioUploader");

    const { data: users = [] } = api.user.getAll.useQuery();
    const options = users.map((user) => ({
        value: user.id,
        displayValue: user.name,
    }));

    const utils = api.useUtils();
    const { data: allEvents } = api.event.getAll.useQuery();

    const createEvent = api.event.create.useMutation({
        onError: () => {
            toast.error("Failed to create event");
        },
    });

    const updateEvent = api.event.update.useMutation({
        onError: () => {
            toast.error("Failed to update event");
        },
    });

    const deleteAsset = api.asset.delete.useMutation({
        onError: () => {
            toast.error("Failed to delete asset");
        },
    });

    const isFormValid = !!(
        activeEvent?.title?.trim() && activeEvent?.speaker?.trim()
    );

    const handleUpdateEvent = (updates: Partial<Event>) => {
        setActiveEvent((prev) => ({ ...prev, ...updates }));
    };

    const resetForm = () => {
        setNotesVisible(false);
        setActiveEvent({});
        initialRecordingIdRef.current = null;
        setSelectedRecordingFile(null);
        setRemoveExistingRecording(false);
    };

    const uploadSelectedRecording = async () => {
        if (!selectedRecordingFile) return null;
        const uploaded = await startUpload([selectedRecordingFile]);
        const maybeFirst = Array.isArray(uploaded) ? uploaded[0] : undefined;
        const assetId = maybeFirst?.serverData?.assetId ?? null;
        if (!assetId) {
            toast.error("Failed to upload recording");
            return null;
        }
        return assetId;
    };

    const handleSave = async () => {
        if (!isFormValid) {
            toast.error("Please fill in all required fields");
            return;
        }

        const isNew = !activeEvent?.id;

        const newRecordingId = await uploadSelectedRecording();

        if (isNew) {
            const payload = {
                title: activeEvent.title!,
                speaker: activeEvent.speaker!,
                recording: newRecordingId,
                slidesUrl: activeEvent.slidesUrl ?? null,
                maxAttendees: activeEvent.maxAttendees ?? null,
                date: activeEvent.date ?? null,
                speakerNotes: activeEvent.speakerNotes ?? null,
            };
            await createEvent.mutateAsync(payload);
        } else {
            const nextRecording =
                newRecordingId ??
                (removeExistingRecording
                    ? null
                    : (activeEvent.recording ?? null));
            const payload = {
                id: activeEvent.id!,
                title: activeEvent.title,
                speaker: activeEvent.speaker,
                recording: nextRecording,
                slidesUrl: activeEvent.slidesUrl ?? null,
                maxAttendees: activeEvent.maxAttendees ?? null,
                date: activeEvent.date ?? null,
                speakerNotes: activeEvent.speakerNotes ?? null,
            };
            await updateEvent.mutateAsync(payload);
            const hadInitial = initialRecordingIdRef.current;
            if (hadInitial && (removeExistingRecording || newRecordingId)) {
                deleteAsset.mutate({ id: hadInitial });
            }
        }
        void utils.event.getAll.invalidate();
        resetForm();
        closeModal();
    };

    const handleClose = () => {
        resetForm();
        closeModal();
    };

    return (
        <Dialog
            open={modalOpen}
            onOpenChange={(open) => {
                if (open) {
                    initialRecordingIdRef.current =
                        activeEvent?.recording ?? null;
                    setSelectedRecordingFile(null);
                    setRemoveExistingRecording(false);
                } else {
                    handleClose();
                }
            }}
        >
            <DialogContent
                showCloseButton={false}
                className="border-border bg-surface border backdrop-blur-xl"
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {activeEvent.id ? "Edit Event" : "Add Event"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 items-center gap-4 px-1 py-4 md:grid-cols-[auto_1fr] md:gap-x-4 md:gap-y-3">
                    <label className="text-sm font-medium md:text-right">
                        Title *
                    </label>
                    <Input
                        value={activeEvent?.title ?? ""}
                        onChange={(e) =>
                            handleUpdateEvent({ title: e.target.value })
                        }
                        placeholder="Event title"
                    />

                    <label className="text-sm font-medium md:text-right">
                        Speaker *
                    </label>
                    <ComboBox
                        value={activeEvent?.speaker ?? ""}
                        onValueChange={(value) =>
                            handleUpdateEvent({ speaker: value })
                        }
                        options={options}
                        placeholder="Select speaker..."
                    />

                    <label className="text-sm font-medium md:text-right">
                        Date
                    </label>
                    <DatePicker
                        selectedDate={activeEvent?.date ?? undefined}
                        onChange={(date) => {
                            date?.setHours(19, 0, 0, 0);
                            handleUpdateEvent({ date: date ?? null });
                        }}
                        className="w-full"
                        placeholder="Set date for event..."
                        highlightedDates={allEvents
                            ?.filter((event) => event.id !== activeEvent?.id)
                            .map((event) => event.date)
                            .filter((date): date is Date => !!date)}
                    />

                    <label className="text-sm font-medium md:text-right">
                        Slides URL
                    </label>
                    <Input
                        value={activeEvent?.slidesUrl ?? ""}
                        onChange={(e) =>
                            handleUpdateEvent({ slidesUrl: e.target.value })
                        }
                        placeholder="https://..."
                    />

                    <label className="text-sm font-medium md:text-right">
                        Recording
                    </label>
                    <RecordingField
                        file={selectedRecordingFile}
                        isUploading={isUploading}
                        fileInputRef={fileInputRef}
                        hasExistingRecording={!!activeEvent?.recording}
                        removeExistingRecording={removeExistingRecording}
                        onClearFile={() => setSelectedRecordingFile(null)}
                        onRequestPickFile={() => fileInputRef.current?.click()}
                        onRemoveExisting={() => {
                            setRemoveExistingRecording(true);
                            handleUpdateEvent({ recording: null });
                        }}
                        onFileSelected={(file) => {
                            setSelectedRecordingFile(file);
                            if (file) setRemoveExistingRecording(false);
                        }}
                    />

                    <label className="text-sm font-medium md:text-right">
                        Notes
                    </label>
                    <NotesField
                        value={activeEvent?.speakerNotes ?? ""}
                        notesVisible={notesVisible}
                        onChange={(val) =>
                            handleUpdateEvent({ speakerNotes: val })
                        }
                        onReveal={() => setNotesVisible(true)}
                    />
                </div>

                <DialogFooter className="flex-col gap-2 md:flex-row">
                    <Button
                        variant="outline"
                        onClick={() => {
                            handleClose();
                        }}
                        className="w-full md:w-auto"
                        disabled={
                            createEvent.isPending || updateEvent.isPending
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={
                            !isFormValid ||
                            createEvent.isPending ||
                            updateEvent.isPending
                        }
                        className="w-full md:w-auto"
                    >
                        {createEvent.isPending || updateEvent.isPending ? (
                            <div className="flex items-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                {activeEvent.id ? "Updating..." : "Creating..."}
                            </div>
                        ) : activeEvent.id ? (
                            "Update Event"
                        ) : (
                            "Create Event"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function RecordingField(props: {
    file: File | null;
    isUploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    hasExistingRecording: boolean;
    removeExistingRecording: boolean;
    onClearFile: () => void;
    onRequestPickFile: () => void;
    onRemoveExisting: () => void;
    onFileSelected: (file: File | null) => void;
}) {
    const hasSelected = !!props.file;
    const hasExisting = props.hasExistingRecording;

    return (
        <div className="flex flex-col gap-2">
            {hasSelected && (
                <div className="flex h-10 w-full items-center gap-2">
                    <div
                        className="max-w-80 min-w-0 truncate text-sm"
                        title={props.file?.name}
                    >
                        {props.file?.name}
                    </div>
                    <div className="flex-1" />
                    <Button
                        variant="outline"
                        onMouseDown={props.onClearFile}
                        className="bg-bg hover:bg-bg/70 border-border h-10 px-3 text-xs"
                    >
                        <X className="mr-1 h-4 w-4" />
                        {"Remove"}
                    </Button>
                    <Button
                        variant="outline"
                        onMouseDown={props.onRequestPickFile}
                        className="bg-bg hover:bg-bg/70 border-border h-10 px-3 text-xs"
                    >
                        <Upload className="mr-1 h-4 w-4" />
                        {"Replace"}
                    </Button>
                </div>
            )}

            {!hasSelected && hasExisting && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onMouseDown={props.onRemoveExisting}
                        className={cn(
                            "bg-bg hover:bg-bg/70 border-border h-10 w-full md:w-auto",
                            props.removeExistingRecording && "opacity-70",
                        )}
                    >
                        <X className="mr-1 h-4 w-4" />
                        {"Remove"}
                    </Button>
                    <Button
                        variant="outline"
                        onMouseDown={props.onRequestPickFile}
                        className="bg-bg hover:bg-bg/70 border-border h-10 w-full md:w-auto"
                    >
                        <Upload className="mr-1 h-4 w-4" />
                        {"Replace"}
                    </Button>
                </div>
            )}

            {!hasSelected && !hasExisting && (
                <Button
                    variant="outline"
                    onMouseDown={props.onRequestPickFile}
                    className={cn(
                        "bg-bg hover:bg-bg/70 border-border h-10 w-full text-sm",
                        props.isUploading && "opacity-50",
                    )}
                >
                    <Upload className="mr-1 h-4 w-4" />
                    {"Choose File"}
                </Button>
            )}

            <input
                ref={props.fileInputRef}
                type="file"
                accept="video/*,audio/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    props.onFileSelected(file);
                }}
            />
        </div>
    );
}

function NotesField(props: {
    value: string;
    notesVisible: boolean;
    onChange: (value: string) => void;
    onReveal: () => void;
}) {
    return (
        <div className="relative">
            <Textarea
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                className={cn(
                    "min-h-[100px] resize-none",
                    !props.notesVisible && "blur-sm select-none",
                )}
                placeholder={
                    props.notesVisible
                        ? "Add secret notes..."
                        : "Click eye icon to reveal notes"
                }
                disabled={!props.notesVisible}
            />
            {!props.notesVisible && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={props.onReveal}
                    className="hover:bg-bg/10 absolute inset-0 h-full w-full cursor-pointer bg-transparent p-0"
                >
                    <Eye className="mr-1 h-4 w-4" />
                    {"Reveal Notes"}
                </Button>
            )}
        </div>
    );
}
