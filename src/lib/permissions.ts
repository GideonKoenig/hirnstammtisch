export type VisibilityOption = "everyone" | "guests" | "members";
export type UserRole = "admin" | "member" | "guest" | "none";

export const defaultPreferences = {
    slidesVisibility: "everyone" as VisibilityOption,
    recordingsVisibility: "everyone" as VisibilityOption,
    membershipVisibility: "everyone" as VisibilityOption,
    speakerStatusVisibility: "everyone" as VisibilityOption,
    attendanceVisibility: "everyone" as VisibilityOption,
};

export type RedactedField<T> = {
    value: T;
    redacted: boolean;
};

export function hasPermission(
    viewerRole: UserRole,
    requiredVisibility: VisibilityOption,
) {
    switch (requiredVisibility) {
        case "everyone":
            return true;
        case "guests":
            return viewerRole !== "none";
        case "members":
            return viewerRole === "member" || viewerRole === "admin";
        default:
            return false;
    }
}

export function createRedactedField<T>(
    value: T,
    viewerRole: UserRole,
    requiredVisibility: VisibilityOption,
) {
    if (hasPermission(viewerRole, requiredVisibility)) {
        return { value, redacted: false };
    }
    return { value: null as T, redacted: true };
}

export function getUserRole(userRole: string | undefined) {
    if (userRole === "admin") return "admin";
    if (userRole === "member") return "member";
    if (userRole === "guest") return "guest";
    return "none";
}
export function hasRoleLevel(
    minimumRequiredRole: UserRole,
    userRole?: UserRole,
) {
    const roleHierarchy = ["admin", "member", "guest", "none"] as const;
    const userIndex = roleHierarchy.indexOf(userRole ?? "none");
    const requiredIndex = roleHierarchy.indexOf(minimumRequiredRole);
    return userIndex <= requiredIndex;
}

export function isSpeakerOrAdmin(
    user: { id: string; role: string } | null | undefined,
    eventSpeakerId: string,
) {
    if (!user) return false;
    const role = getUserRole(user.role);
    if (role === "admin") return true;
    return user.id === eventSpeakerId;
}
