"use client";

import { useState } from "react";
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
import { UploadButton } from "@/lib/uploadthing";
import { useEvents } from "@/components/events/event-context";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Eye, Upload, X, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

// Todo: BIG TODO. The uploading of recordings is kinda messed up right now. Its way to complicated and the issue is, that if i upload an asset but then close the modal, it needs to get deleted. also, when i want to "remove" a recording from a event, then i need to do it immediately, and the "save" doesnt do anything, because i need to modify the event before saving it, because i cant delete the asset otherwise, because of a foreign key constraint. so i guess in need to handle the upload and linking, or unlinking and deletion on the hitting of the save button. this makes the handling through recordingId on active element much more difficult though.

export function EventModal() {
    const { modalOpen, activeEvent, closeModal, setActiveEvent } = useEvents();
    const [notesVisible, setNotesVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { data: users } = api.user.getAll.useQuery();
    const options =
        users?.map((user) => ({
            value: user.id,
            displayValue: user.name,
        })) ?? [];
    const utils = api.useUtils();
    const { data: allEvents } = api.event.getAll.useQuery();

    const createEvent = api.event.create.useMutation({
        onSuccess: () => {
            void utils.event.getAll.invalidate();
            setNotesVisible(false);
            setActiveEvent({});
            closeModal();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const updateEvent = api.event.update.useMutation({
        onSuccess: () => {
            void utils.event.getAll.invalidate();
            setNotesVisible(false);
            setActiveEvent({});
            closeModal();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteAsset = api.asset.delete.useMutation({
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const isFormValid = !!(
        activeEvent?.title?.trim() && activeEvent?.speaker?.trim()
    );

    const handleUpdateEvent = (updates: Partial<Event>) => {
        setActiveEvent((prev) => ({ ...prev, ...updates }));
    };

    const handleSave = async () => {
        if (!isFormValid) {
            toast.error("Please fill in all fields");
            return;
        }

        const isNew = !activeEvent?.id;

        if (isNew) {
            const newEvent = {
                ...activeEvent,
                title: activeEvent.title!,
                speaker: activeEvent.speaker!,
            };
            createEvent.mutate(newEvent);
        } else {
            const updatedEvent = {
                ...activeEvent,
                id: activeEvent.id!,
            };
            updateEvent.mutate(updatedEvent);
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        setNotesVisible(false);
        setActiveEvent({});
        closeModal();
    };

    return (
        <Dialog open={modalOpen} onOpenChange={closeModal}>
            <ScrollArea className="max-h-[90vh]">
                <DialogContent
                    showCloseButton={false}
                    className="border-border bg-surface border backdrop-blur-xl"
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {activeEvent.id ? "Edit Event" : "Add Event"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 items-center gap-4 py-4 pr-1 md:grid-cols-[auto_1fr] md:gap-x-4 md:gap-y-3">
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
                                ?.filter(
                                    (event) => event.id !== activeEvent?.id,
                                )
                                .map((event) => event.date)
                                .filter((date): date is Date => !!date)}
                        />

                        <label className="text-sm font-medium md:text-right">
                            Slides URL
                        </label>
                        <Input
                            value={activeEvent?.slidesUrl ?? ""}
                            onChange={(e) =>
                                handleUpdateEvent({
                                    slidesUrl: e.target.value,
                                })
                            }
                            placeholder="https://..."
                        />

                        <label className="text-sm font-medium md:text-right">
                            Recording
                        </label>
                        <div>
                            {activeEvent?.recording ? (
                                <Button
                                    variant="outline"
                                    onMouseDown={() => {
                                        deleteAsset.mutate({
                                            id: activeEvent.recording!,
                                        });
                                        handleUpdateEvent({
                                            recording: null,
                                        });
                                    }}
                                    className="bg-bg hover:bg-bg/70 border-border flex h-10 w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
                                >
                                    <X className="h-4 w-4" />
                                    Remove Recording
                                </Button>
                            ) : (
                                <UploadButton
                                    appearance={{
                                        container: "w-full",
                                        button: cn(
                                            "w-full h-10 font-medium py-2 px-4 rounded-md text-sm bg-bg hover:bg-bg/70 border border-border flex items-center justify-center gap-2",
                                            isUploading &&
                                                "opacity-50 cursor-not-allowed",
                                        ),
                                        allowedContent: "hidden",
                                    }}
                                    content={{
                                        button: isUploading ? (
                                            <div className="flex items-center gap-2">
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                Uploading...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Upload className="h-4 w-4" />
                                                Upload File
                                            </div>
                                        ),
                                    }}
                                    endpoint="videoAudioUploader"
                                    onUploadBegin={() => setIsUploading(true)}
                                    onUploadError={(error) => {
                                        toast.error(error.message);
                                        setIsUploading(false);
                                    }}
                                    onClientUploadComplete={(result) => {
                                        const assetId =
                                            result[0]?.serverData?.assetId;
                                        if (!assetId)
                                            toast.error(
                                                "Failed to upload recording",
                                            );

                                        handleUpdateEvent({
                                            recording: assetId,
                                        });
                                        setIsUploading(false);
                                    }}
                                />
                            )}
                        </div>

                        <label className="text-sm font-medium md:text-right">
                            Notes
                        </label>
                        <div className="relative">
                            <Textarea
                                value={activeEvent?.speakerNotes ?? ""}
                                onChange={(event) =>
                                    handleUpdateEvent({
                                        speakerNotes: event.target.value,
                                    })
                                }
                                className={cn(
                                    "min-h-[100px] resize-none",
                                    !notesVisible && "blur-sm select-none",
                                )}
                                placeholder={
                                    notesVisible
                                        ? "Add secret notes..."
                                        : "Click eye icon to reveal notes"
                                }
                                disabled={!notesVisible}
                            />
                            {!notesVisible && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setNotesVisible(true)}
                                    className="hover:bg-bg/10 absolute inset-0 h-full w-full cursor-pointer bg-transparent p-0"
                                >
                                    <Eye className="mr-1 h-4 w-4" />
                                    {"Reveal Notes"}
                                </Button>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 md:flex-row">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNotesVisible(false);
                                closeModal();
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
                                    {activeEvent
                                        ? "Updating..."
                                        : "Creating..."}
                                </div>
                            ) : activeEvent ? (
                                "Update Event"
                            ) : (
                                "Create Event"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </ScrollArea>
        </Dialog>
    );
}
