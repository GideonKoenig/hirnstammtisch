"use client";

import { Eye, Globe, Shield, Users } from "lucide-react";
import { api } from "@/trpc/react";
import { cn, useUser } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type VisibilityOption = "everyone" | "guests" | "members";

type PreferenceKey =
    | "slidesVisibility"
    | "recordingsVisibility"
    | "membershipVisibility"
    | "speakerStatusVisibility"
    | "attendanceVisibility";

interface PreferenceItem {
    key: PreferenceKey;
    label: string;
    description: string;
}

const VISIBILITY_OPTIONS = [
    {
        value: "everyone" as const,
        label: "Everyone",
        icon: Globe,
        description: "Visible to all users",
    },
    {
        value: "guests" as const,
        label: "Guests",
        icon: Eye,
        description: "Visible to guests and above",
    },
    {
        value: "members" as const,
        label: "Members Only",
        icon: Users,
        description: "Only visible to members",
    },
] as const;

const PREFERENCES: PreferenceItem[] = [
    {
        key: "slidesVisibility",
        label: "Slides",
        description: "Who can acess your presentation slides",
    },
    {
        key: "recordingsVisibility",
        label: "Recordings",
        description: "Who can acess your recorded presentations",
    },
    // {
    //     key: "membershipVisibility",
    //     label: "Membership",
    //     description: "Who can see that you are a member",
    // },
    // {
    //     key: "speakerStatusVisibility",
    //     label: "Speaker Status",
    //     description: "Who can see your speaker status",
    // },
    // {
    //     key: "attendanceVisibility",
    //     label: "Attendance Visibility",
    //     description: "Who can see which events you have attended",
    // },
];

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
    const userId = user?.id ?? "";
    const utils = api.useUtils();

    const { data: preferences, error } = api.preference.get.useQuery(
        {
            userId,
        },
        {
            enabled: !!userId,
        },
    );
    if (error) toast.error(error.message);

    const updatePreference = api.preference.update.useMutation({
        async onMutate(newPreference) {
            await utils.preference.get.cancel({ userId });
            const prevData = utils.preference.get.getData({ userId });
            utils.preference.get.setData({ userId }, (old) => {
                if (!old) return old;
                return { ...old, ...newPreference };
            });
            return { prevData };
        },
        onError(error, newPreference, ctx) {
            if (ctx?.prevData) {
                utils.preference.get.setData({ userId }, ctx.prevData);
            }
            toast.error(error.message);
        },
        onSettled() {
            utils.preference.get.invalidate({ userId });
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
                                userId: user.id,
                                [key]: value,
                            });
                        }}
                    />
                );
            })}
        </div>
    );
}
