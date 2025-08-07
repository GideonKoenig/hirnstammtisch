"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/use-user";
import { InputText } from "@/components/ui/input-text";
import { RoleBadge } from "@/components/ui/role-badge";

export function ProfileInfo(props: { className?: string }) {
    const user = useUser();
    if (!user) return null;

    return (
        <div
            className={cn(
                "border-border bg-bg-muted grid grid-cols-2 items-center gap-2 rounded-lg border p-6",
                props.className,
            )}
        >
            <h2 className="text-text col-span-2 text-lg font-semibold">
                Account Information
            </h2>

            <label className="text-text text-sm font-medium">Name</label>
            <InputText
                value={user.name}
                onSave={async (name) => {
                    await authClient.updateUser({ name });
                }}
                placeholder="Enter your name"
            />

            <label className="text-text text-sm font-medium">Email</label>
            <span className="text-text flex flex-col text-sm md:flex-row">
                {user.email}
                {user.emailVerified && (
                    <span className="bg-success/20 text-success w-fit rounded px-2 py-1 text-xs md:ml-2">
                        Verified
                    </span>
                )}
            </span>

            <label className="text-text text-sm font-medium">Role</label>
            <div className="flex items-center">
                <RoleBadge role={user.role} />
            </div>

            <label className="text-sm font-medium">Member Since</label>
            <span className="text-text-muted text-sm">
                {new Date(user.createdAt).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </span>

            <label className="text-sm font-medium">User ID</label>
            <span className="text-text-muted truncate font-mono text-sm">
                {user.id}
            </span>
        </div>
    );
}
