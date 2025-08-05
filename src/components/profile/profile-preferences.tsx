"use client";

import { Shield } from "lucide-react";
import { api } from "@/trpc/react";
import { cn, useUser } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PREFERENCES, VISIBILITY_OPTIONS } from "@/lib/permissions/preferences";
import type {
    PreferenceItem,
    VisibilityOption,
    PreferenceKey,
} from "@/lib/permissions/types";

function PreferenceRow(props: {
    preference: PreferenceItem;
    currentValue: VisibilityOption;
    onUpdate: (key: PreferenceKey, value: VisibilityOption) => void;
}) {
    return (
        <div className="flex flex-col justify-between gap-2 lg:flex-row">
            <div>
                <label className="text-text text-sm font-medium">
                    {props.preference.label}
                </label>
                <p className="text-text-muted text-xs">
                    {props.preference.description}
                </p>
            </div>

            <div className="flex gap-1">
                {VISIBILITY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = props.currentValue === option.value;

                    return (
                        <Button
                            key={option.value}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                props.onUpdate(
                                    props.preference.key,
                                    option.value,
                                )
                            }
                            className={cn(
                                "gap-2 text-sm",
                                isSelected
                                    ? "bg-accent/20 border-accent text-accent"
                                    : "hover:bg-border",
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {option.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}

export function ProfilePreferences(props: { className?: string }) {
    const user = useUser();
    const utils = api.useUtils();

    const { data: preferences, error } = api.preference.get.useQuery(
        undefined,
        {
            enabled: !!user,
        },
    );
    if (error) toast.error(error.message);

    const updatePreference = api.preference.update.useMutation({
        async onMutate(newPreference) {
            await utils.preference.get.cancel();
            const prevData = utils.preference.get.getData();
            utils.preference.get.setData(
                undefined,
                (old: typeof preferences) => {
                    if (!old) return old;
                    return { ...old, ...newPreference };
                },
            );
            return { prevData };
        },
        onError(error, newPreference, ctx) {
            if (ctx?.prevData) {
                utils.preference.get.setData(undefined, ctx.prevData);
            }
            toast.error(error.message);
        },
        onSettled() {
            void utils.preference.get.invalidate();
        },
    });

    if (!user || !preferences) return null;

    return (
        <div
            className={cn(
                "border-border bg-bg-muted flex flex-col gap-4 rounded-lg border p-6",
                props.className,
            )}
        >
            <div className="flex items-center gap-3">
                <Shield className="text-text-muted h-10 w-10" />
                <div>
                    <h2 className="text-text text-lg font-semibold">
                        Privacy Preferences
                    </h2>
                    <p className="text-text-muted text-sm">
                        Control who can see your content and information
                    </p>
                </div>
            </div>

            {PREFERENCES.map((preference) => {
                const currentValue = preferences[preference.key];

                return (
                    <PreferenceRow
                        key={preference.key}
                        preference={preference}
                        currentValue={currentValue}
                        onUpdate={(key, value) => {
                            updatePreference.mutate({
                                [key]: value,
                            });
                        }}
                    />
                );
            })}
        </div>
    );
}
