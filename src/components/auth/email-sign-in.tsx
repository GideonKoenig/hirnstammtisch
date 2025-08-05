"use client";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/lib/try-catch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function EmailSignIn() {
    const [loading, setLoading] = useState(false);

    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                setLoading(true);
                const formData = new FormData(event.currentTarget);
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                const result = await tryCatch(
                    authClient.signIn.email({
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
            <div>
                <label htmlFor="email" className="block text-sm font-medium">
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
            <div>
                <label htmlFor="password" className="block text-sm font-medium">
                    Password
                </label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                />
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
}
