"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--color-bg)",
                    "--normal-text": "var(--color-text)",
                    "--normal-border": "var(--color-border)",
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };
