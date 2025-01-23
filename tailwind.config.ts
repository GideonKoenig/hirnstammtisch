import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import AnimtePlugin from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                text: {
                    normal: "rgb(255 255 244)",
                    muted: "rgb(170 170 170)",
                    dark: "rgb(16 22 23)",
                },
                menu: {
                    main: "rgb(33 36 37)",
                    light: "rgb(55 60 62)",
                    hover: "rgb(71 77 79)",
                    dark: "rgb(20 23 25)",
                },
                accent: "rgb(210,22,22)",
            },
        },
    },
    plugins: [AnimtePlugin],
} satisfies Config;
