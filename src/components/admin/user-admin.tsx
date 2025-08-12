"use client";

import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { RoleBadge } from "@/components/ui/role-badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LegacyMigration } from "@/components/admin/legacy-migration";

export function UserAdmin(props: {
    className?: string;
    legacyUsers?: { id: number; name: string; createdAt?: string }[];
    actionMigrate?: (
        formData: FormData,
    ) => Promise<{ ok: true; inserted: number }>;
    actionLoadLegacy?: (
        formData: FormData,
    ) => Promise<{ title: string; date: string | null; deleted: boolean }[]>;
    actionStatus?: (
        formData: FormData,
    ) => Promise<{ totalOld: number; migrated: number; missing: number }>;
}) {
    const utils = api.useUtils();
    const { data: users = [], isLoading } = api.user.getAll.useQuery();

    const [search, setSearch] = useState("");

    const [selectedLegacy, setSelectedLegacy] = useState<
        Record<string, number | undefined>
    >({});
    const [statusByUser, setStatusByUser] = useState<
        Record<
            string,
            { totalOld: number; migrated: number; missing: number } | undefined
        >
    >({});
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewEvents, setPreviewEvents] = useState<
        { title: string; date: string | null; deleted: boolean }[]
    >([]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return users;
        return users.filter((u) =>
            [u.name, u.id].some((v) => v.toLowerCase().includes(term)),
        );
    }, [users, search]);

    const roleMut = api.user.setRole.useMutation({
        onSuccess: async () => {
            await utils.user.getAll.invalidate();
            toast.success("Role updated");
        },
        onError: (e) => toast.error(e.message),
    });
    const createdMut = api.user.setCreatedAt.useMutation({
        onSuccess: async () => {
            await utils.user.getAll.invalidate();
            toast.success("Creation date updated");
        },
        onError: (e) => toast.error(e.message),
    });

    const roleOptions = [
        { value: "guest", displayValue: "Guest" },
        { value: "member", displayValue: "Member" },
        { value: "admin", displayValue: "Admin" },
    ];
    const legacyOptions = (props.legacyUsers ?? []).map((u) => ({
        value: String(u.id),
        displayValue: u.name,
    }));

    return (
        <div className={props.className}>
            <div className="mb-3 grid grid-cols-[1fr_auto] items-center gap-2">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users"
                    className="h-8"
                />
                <div className="text-text-muted shrink-0 text-xs whitespace-nowrap">
                    {isLoading ? "Loading..." : `${filtered.length} users`}
                </div>
            </div>

            <div className="grid gap-2">
                {filtered.map((u) => (
                    <div
                        key={u.id}
                        className="border-border bg-surface grid grid-cols-1 items-center gap-2 rounded border p-3 md:grid-cols-[minmax(0,1fr)_10rem_14rem_7rem]"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                    {u.name}
                                </div>
                                <div className="text-text-muted truncate text-xs">
                                    {u.id}
                                </div>
                            </div>
                            <RoleBadge role={u.role} />
                        </div>

                        <ComboBox
                            value={u.role}
                            onValueChange={(value) => {
                                if (!value) return;
                                roleMut.mutate({
                                    id: u.id,
                                    role: value as "guest" | "member" | "admin",
                                });
                            }}
                            options={roleOptions}
                            placeholder="Set role"
                            className="w-full"
                        />
                        <DatePicker
                            selectedDate={u.createdAt}
                            onChange={(date) => {
                                if (!date) return;
                                createdMut.mutate({
                                    id: u.id,
                                    createdAt: date,
                                });
                            }}
                        />
                        {(() => {
                            const selected = selectedLegacy[u.id];
                            if (!selected) return null;
                            const legacy = (props.legacyUsers ?? []).find(
                                (lu) => lu.id === selected,
                            );
                            const original = legacy?.createdAt
                                ? new Date(legacy.createdAt)
                                : undefined;
                            if (!original) return null;
                            const isSame =
                                original.toDateString() ===
                                new Date(u.createdAt).toDateString();
                            if (isSame) return null;
                            return (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        createdMut.mutate({
                                            id: u.id,
                                            createdAt: original,
                                        });
                                    }}
                                    className="h-10 w-full px-2 text-xs md:w-auto"
                                >
                                    Original
                                </Button>
                            );
                        })()}
                        {(() => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const created = new Date(u.createdAt);
                            created.setHours(0, 0, 0, 0);
                            const isToday =
                                created.getTime() === today.getTime();
                            if (isToday) return null;
                            return (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const date = new Date();
                                        createdMut.mutate({
                                            id: u.id,
                                            createdAt: date,
                                        });
                                    }}
                                    className="h-10 w-full px-2 text-xs md:w-auto"
                                >
                                    Today
                                </Button>
                            );
                        })()}

                        {legacyOptions.length > 0 && (
                            <LegacyMigration
                                className="md:col-span-4"
                                userId={u.id}
                                userName={u.name}
                                legacyOptions={legacyOptions}
                                selectedLegacy={selectedLegacy[u.id]}
                                onLegacyChange={(legacyId) => {
                                    setSelectedLegacy((prev) => ({
                                        ...prev,
                                        [u.id]: legacyId,
                                    }));
                                }}
                                onStatus={(st) =>
                                    setStatusByUser((prev) => ({
                                        ...prev,
                                        [u.id]: st,
                                    }))
                                }
                                actionLoadLegacy={props.actionLoadLegacy}
                                actionMigrate={props.actionMigrate}
                                actionStatus={props.actionStatus}
                                status={statusByUser[u.id]}
                                onPreview={(title, list) => {
                                    setPreviewTitle(title);
                                    setPreviewEvents(list);
                                    setPreviewOpen(true);
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{previewTitle}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        {previewEvents.map((e, i) => (
                            <div
                                key={`${e.title}-${i}`}
                                className="border-border bg-surface rounded border p-2"
                            >
                                <div className="truncate text-sm font-medium">
                                    {e.title}
                                </div>
                                <div className="text-text-muted text-xs">
                                    {e.date
                                        ? new Date(e.date).toLocaleString(
                                              "de-DE",
                                          )
                                        : "No date"}
                                    {e.deleted ? " • deleted" : ""}
                                </div>
                            </div>
                        ))}
                        {previewEvents.length === 0 && (
                            <div className="text-text-muted text-sm">
                                No legacy events found.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
