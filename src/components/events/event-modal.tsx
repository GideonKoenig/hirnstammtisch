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
import { AssetUploader } from "@/components/events/attachment-uploader";
import { useEvents } from "@/components/events/event-context";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Eye, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";

export function EventModal() {
    const { modalOpen, activeEvent, closeModal, setActiveEvent } = useEvents();
    const [notesVisible, setNotesVisible] = useState(false);

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

    const isFormValid = !!(
        activeEvent?.title?.trim() && activeEvent?.speaker?.trim()
    );

    const handleUpdateEvent = (updates: Partial<Event>) => {
        setActiveEvent((prev) => ({ ...prev, ...updates }));
    };

    const resetForm = () => {
        setNotesVisible(false);
        setActiveEvent({});
    };

    const isNewEvent = !activeEvent?.id;
    const handleSave = async () => {
        if (!isFormValid) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (isNewEvent) {
            const payload = {
                title: activeEvent.title!,
                speaker: activeEvent.speaker!,
                maxAttendees: activeEvent.maxAttendees ?? null,
                date: activeEvent.date ?? null,
                speakerNotes: activeEvent.speakerNotes ?? null,
            };
            await createEvent.mutateAsync(payload);
        } else {
            const payload = {
                id: activeEvent.id!,
                title: activeEvent.title,
                speaker: activeEvent.speaker,
                maxAttendees: activeEvent.maxAttendees ?? null,
                date: activeEvent.date ?? null,
                speakerNotes: activeEvent.speakerNotes ?? null,
            };
            await updateEvent.mutateAsync(payload);
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
                if (!open) handleClose();
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

                <div className="grid grid-cols-1 items-start gap-4 px-1 py-4 md:grid-cols-[auto_1fr] md:gap-x-4 md:gap-y-3">
                    <label className="pt-2 text-sm font-medium md:text-right">
                        Title *
                    </label>
                    <Input
                        value={activeEvent?.title ?? ""}
                        onChange={(e) =>
                            handleUpdateEvent({ title: e.target.value })
                        }
                        placeholder="Event title"
                    />

                    <label className="pt-2 text-sm font-medium md:text-right">
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

                    <label className="pt-2 text-sm font-medium md:text-right">
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

                    <label className="pt-2 text-sm font-medium md:text-right">
                        Attachments
                    </label>
                    <AssetUploader eventId={activeEvent?.id} />

                    <label className="pt-2 text-sm font-medium md:text-right">
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
                                {isNewEvent ? "Creating..." : "Updating..."}
                            </div>
                        ) : isNewEvent ? (
                            "Create Event"
                        ) : (
                            "Update Event"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
