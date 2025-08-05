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
    return { value: null as T, redacted: true };
}
