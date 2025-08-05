import { UserRole, VisibilityOption } from "@/lib/permissions/types";

export function checkAccess(
    userRole: UserRole = "none",
    expectedRole: UserRole,
) {
    const roleHierarchy = ["admin", "member", "guest", "none"] as const;
    const userIndex = roleHierarchy.indexOf(userRole);
    const requiredIndex = roleHierarchy.indexOf(expectedRole);
    return userIndex <= requiredIndex;
}

export function checkVisibility(
    viewerRole: UserRole,
    requiredVisibility: VisibilityOption | null | undefined,
) {
    switch (requiredVisibility) {
        case null:
        case undefined:
        case "everyone":
            return true;
        case "members":
            return viewerRole === "member" || viewerRole === "admin";
        default:
            return false;
    }
}

export function parseUserRole(userRole: string | undefined) {
    if (userRole === "admin") return "admin";
    if (userRole === "member") return "member";
    if (userRole === "guest") return "guest";
    return "none";
}

export function isSpeakerOrAdmin(
    user: { id: string; role: string } | null | undefined,
    eventSpeakerId: string,
) {
    if (!user) return false;
    const role = parseUserRole(user.role);
    if (role === "admin") return true;
    return user.id === eventSpeakerId;
}
