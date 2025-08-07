import { withPlausibleProxy } from "next-plausible";
import withSerwistInit from "@serwist/next";
await import("./src/env.js");

const config = {
    images: {
        remotePatterns: [
            {
                hostname: "utfs.io",
            },
            {
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    turbopack: {},
    experimental: {
        reactCompiler: true,
    },
};

const isDev = process.env.NODE_ENV === "development";

const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    disable: isDev,
});

const withPlausible = withPlausibleProxy({
    customDomain: "https://plausible.gko.gg",
});

export default isDev
    ? withPlausible(config)
    : withSerwist(withPlausible(config));
