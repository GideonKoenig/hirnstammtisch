import { EmailSignUp } from "@/components/auth/email-sign-up";
import { Link } from "@/components/ui/fast-link";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign up",
    description: "Create your HirnStammtisch account.",
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
    alternates: { canonical: "/signup" },
};

export default function SignUpPage() {
    return (
        <div className="flex grow flex-col items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 md:max-w-md md:gap-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        Create Account
                    </h1>
                    <p className="text-text-muted mt-2 text-sm md:text-base">
                        Sign up to get started
                    </p>
                </div>

                <EmailSignUp />

                <div className="text-center">
                    <p className="text-text-muted text-sm md:text-base">
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
