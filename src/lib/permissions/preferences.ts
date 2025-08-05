import { PreferenceItem, VisibilityOption } from "@/lib/permissions/types";
import { Globe, Users } from "lucide-react";

export const VISIBILITY_OPTIONS = [
    {
        value: "everyone" as const,
        label: "Everyone",
        icon: Globe,
        description: "Visible to all users",
    },
    {
        value: "members" as const,
        label: "Members Only",
        icon: Users,
        description: "Only visible to members",
    },
] as const;

export const PREFERENCES: PreferenceItem[] = [
    {
        key: "slidesVisibility",
        label: "Slides",
        description: "Who can acess your presentation slides",
    },
];

export const PREFERENCES_DEFAULT = {
    slidesVisibility: "everyone" as VisibilityOption,
};
