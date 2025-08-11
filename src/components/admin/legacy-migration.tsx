"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combobox";

export function LegacyMigration(props: {
    userId: string;
    userName: string;
    legacyOptions: { value: string; displayValue: string }[];
    selectedLegacy?: number;
    onLegacyChange: (legacyId?: number) => void;
    actionLoadLegacy?: (
        formData: FormData,
    ) => Promise<{ title: string; date: string | null; deleted: boolean }[]>;
    actionMigrate?: (
        formData: FormData,
    ) => Promise<{ ok: true; inserted: number }>;
    actionStatus?: (
        formData: FormData,
    ) => Promise<{ totalOld: number; migrated: number; missing: number }>;
    onStatus?: (status: {
        totalOld: number;
        migrated: number;
        missing: number;
    }) => void;
    onPreview: (
        title: string,
        events: { title: string; date: string | null; deleted: boolean }[],
    ) => void;
    status?: { totalOld: number; migrated: number; missing: number };
    className?: string;
}) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className={props.className}>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[22rem_7rem_7rem_12rem] md:items-center">
                <ComboBox
                    value={
                        props.selectedLegacy ? String(props.selectedLegacy) : ""
                    }
                    onValueChange={(value) => {
                        const num = value ? Number(value) : undefined;
                        props.onLegacyChange(num);
                        if (!num || !props.actionStatus || !props.onStatus)
                            return;
                        const fd = new FormData();
                        fd.set("oldUserId", String(num));
                        fd.set("targetUserId", props.userId);
                        startTransition(async () => {
                            const res = await props.actionStatus!(fd);
                            props.onStatus!(res);
                        });
                    }}
                    options={props.legacyOptions}
                    placeholder="Legacy user..."
                    className="w-full max-w-[22rem]"
                />
                <Button
                    variant="outline"
                    disabled={
                        !props.selectedLegacy ||
                        isPending ||
                        !props.actionLoadLegacy
                    }
                    onClick={() => {
                        const oldId = props.selectedLegacy;
                        if (!oldId || !props.actionLoadLegacy) return;
                        const fd = new FormData();
                        fd.set("oldUserId", String(oldId));
                        startTransition(async () => {
                            const list = await props.actionLoadLegacy!(fd);
                            props.onPreview(
                                `${props.userName} – Legacy events`,
                                list,
                            );
                        });
                    }}
                    className="h-10 w-[6.5rem] justify-center px-0 text-xs"
                >
                    Preview
                </Button>
                <Button
                    variant="accent"
                    disabled={
                        !props.selectedLegacy ||
                        isPending ||
                        !props.actionMigrate
                    }
                    onClick={() => {
                        const oldId = props.selectedLegacy;
                        if (!oldId || !props.actionMigrate) return;
                        const fd = new FormData();
                        fd.set("oldUserId", String(oldId));
                        fd.set("targetUserId", props.userId);
                        startTransition(async () => {
                            await props.actionMigrate!(fd);
                        });
                    }}
                    className="h-10 w-[6.5rem] justify-center px-0 text-xs"
                >
                    {isPending ? "Migrating..." : "Migrate"}
                </Button>
                {props.selectedLegacy ? (
                    <div className="flex h-10 items-center text-xs">
                        {(() => {
                            const st = props.status;
                            if (!st)
                                return (
                                    <span className="text-text-muted">
                                        Status…
                                    </span>
                                );
                            if (st.totalOld === 0)
                                return (
                                    <span className="text-text-muted">
                                        No legacy
                                    </span>
                                );
                            if (st.missing === 0)
                                return (
                                    <span className="text-success">
                                        All migrated ({st.totalOld})
                                    </span>
                                );
                            return (
                                <span className="text-warning">
                                    Missing {st.missing} / {st.totalOld}
                                </span>
                            );
                        })()}
                    </div>
                ) : (
                    <div className="h-8" />
                )}
            </div>
        </div>
    );
}
