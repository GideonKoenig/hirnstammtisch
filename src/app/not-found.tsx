import Image from "next/image";

export default function NotFoundPage() {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 p-4 text-center md:gap-6">
            <Image
                src="/icon.svg"
                alt=""
                width={120}
                height={120}
                priority
                className="opacity-90"
            />
            <div className="text-6xl font-extrabold tracking-tight md:text-7xl">
                404
            </div>
            <p className="text-text-muted text-base md:text-lg">
                {`Looks like you grabbed the wrong table—your Stammtisch isn’t here.`}
            </p>
        </div>
    );
}
