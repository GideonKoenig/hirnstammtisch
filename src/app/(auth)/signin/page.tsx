"use client";

import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { EmailSignIn } from "@/components/auth/email-sign-in";
import { Link } from "@/components/ui/fast-link";

export default function SignInPage() {
    return (
        <div className="flex grow flex-col items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 sm:max-w-md sm:gap-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Welcome Back
                    </h1>
                    <p className="text-text-muted mt-2 text-sm sm:text-base">
                        Sign in to your account
                    </p>
                </div>

                <GoogleSignIn />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="border-border w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-bg text-text-muted px-2">Or</span>
                    </div>
                </div>

                <EmailSignIn />

                <div className="text-center">
                    <p className="text-text-muted text-sm sm:text-base">
                        {"Don't have an account? "}
                        <Link
                            href="/signup"
                            className="text-accent hover:text-accent/90 font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
