"use client";

import { EmailSignUp } from "@/components/auth/email-sign-up";
import { Link } from "@/components/ui/fast-link";

export default function SignUpPage() {
    return (
        <div className="flex grow flex-col items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 sm:max-w-md sm:gap-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Create Account
                    </h1>
                    <p className="text-text-muted mt-2 text-sm sm:text-base">
                        Sign up to get started
                    </p>
                </div>

                <EmailSignUp />

                <div className="text-center">
                    <p className="text-text-muted text-sm sm:text-base">
                        {"Already have an account? "}
                        <Link
                            href="/signin"
                            className="text-accent hover:text-accent/90 font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
