"use client";

import { Download, LogOut } from "lucide-react";
import { usePwa } from "@/components/pwa/pwa-provider";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ProfileHeader(props: { className?: string }) {
    const { installPrompt, isInstallable } = usePwa();
    const router = useRouter();

    return (
        <div
            className={cn(
                "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                props.className,
            )}
        >
            <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-text-muted text-sm">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="flex flex-row gap-2">
                <Button
                    variant="default"
                    className={cn("hidden", isInstallable && "flex")}
                    onMouseDown={async () => {
                        await installPrompt();
                    }}
                >
                    <Download className="mr-1 h-4 w-4" />
                    {"Install App"}
                </Button>

                <Button
                    variant="accent"
                    onMouseDown={() => {
                        void authClient.signOut();
                        router.push("/signin");
                    }}
                >
                    <LogOut className="mr-1 h-4 w-4" />
                    {"Sign Out"}
                </Button>
            </div>
        </div>
    );
}
