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
    experimental: {
        reactCompiler: true,
    },
};

const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV === "development",
});

const withPlausible = withPlausibleProxy({
    customDomain: "https://plausible.gko.gg",
});

export default withSerwist(withPlausible(config));
