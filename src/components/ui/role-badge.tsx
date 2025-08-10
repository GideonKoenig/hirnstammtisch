import { Badge } from "@/components/ui/badge";
import { type UserRole } from "@/lib/permissions/types";
import { cn } from "@/lib/utils";

export function RoleBadge(props: { role: UserRole; className?: string }) {
    if (props.role === "admin") {
        return (
            <Badge
                className={cn(
                    "bg-accent/20 text-accent border-accent/30",
                    props.className,
                )}
            >
                Admin
            </Badge>
        );
    }

    if (props.role === "member") {
        return (
            <Badge
                className={cn(
                    "bg-success/20 text-success border-success/30",
                    props.className,
                )}
            >
                Member
            </Badge>
        );
    }

    if (props.role === "guest") {
        return (
            <Badge
                className={cn(
                    "bg-text-muted/20 text-text-muted border-text-muted/30",
                    props.className,
                )}
            >
                Guest
            </Badge>
        );
    }

    return (
        <Badge
            className={cn(
                "bg-text-muted/20 text-text-muted border-text-muted/30",
                props.className,
            )}
        >
            {props.role}
        </Badge>
    );
}
