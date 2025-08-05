import z from "zod";

export type UserRole = "admin" | "member" | "guest" | "none";

export type RedactedField<T> = {
    value: T;
    redacted: boolean;
};

export type VisibilityOption = "everyone" | "members";
export const VisibilityOptionsZod = z.enum(["everyone", "members"] as const);

export type PreferenceKey = "slidesVisibility";

export type PreferenceItem = {
    key: PreferenceKey;
    label: string;
    description: string;
};
