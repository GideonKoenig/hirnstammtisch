import type { UserRole, VisibilityOption } from "@/lib/permissions/types";
import { checkVisibility } from "@/lib/permissions/utilts";

export function createRedactedField<T>(
    value: T,
    viewerRole: UserRole,
    requiredVisibility: VisibilityOption,
) {
    if (checkVisibility(viewerRole, requiredVisibility)) {
        return { value, redacted: false };
    }
    // If there's nothing to show, don't mark as redacted
    if (value == null) {
        return { value: null as T, redacted: false };
    }
    return { value: null as T, redacted: true };
}
