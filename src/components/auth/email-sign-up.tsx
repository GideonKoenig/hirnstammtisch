"use client";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/lib/try-catch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function EmailSignUp() {
    const [loading, setLoading] = useState(false);

    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                setLoading(true);
                const formData = new FormData(event.currentTarget);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                const result = await tryCatch(
                    authClient.signUp.email({
                        name,
                        email,
                        password,
                        callbackURL: "/profile",
                    }),
                );

                if (!result.success) {
                    toast.error(result.error.message);
                }

                setLoading(false);
            }}
            className="flex flex-col gap-4"
        >
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="name"
                    className="text-text-muted text-sm font-medium"
                >
                    Name
                </label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="email"
                    className="text-text-muted text-sm font-medium"
                >
                    Email
                </label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="password"
                    className="text-text-muted text-sm font-medium"
                >
                    Password
                </label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                />
            </div>
            <Button type="submit" variant="accent" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
            </Button>
        </form>
    );
}
