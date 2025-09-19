import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { EmailSignIn } from "@/components/auth/email-sign-in";
import { Link } from "@/components/ui/fast-link";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in - Hirnstammtisch",
    description:
        "Hirnstammtisch is a local group of curious young people in the Bonn area meeting regularly in person for prepared talks on interesting topics. Sign in to access your account.",
    openGraph: {
        title: "Sign in - Hirnstammtisch",
        description:
            "Hirnstammtisch is a local group of curious young people in the Bonn area meeting regularly in person for prepared talks on interesting topics. Sign in to access your account.",
    },
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
    alternates: { canonical: "/signin" },
};

export default function SignInPage() {
    return (
        <div className="flex grow flex-col items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 md:max-w-md md:gap-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        Welcome Back
                    </h1>
                    <p className="text-text-muted mt-2 text-sm md:text-base">
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
                    <p className="text-text-muted text-sm md:text-base">
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
