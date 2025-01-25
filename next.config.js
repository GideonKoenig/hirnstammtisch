import { withPlausibleProxy } from "next-plausible";
import withSerwistInit from "@serwist/next";
await import("./src/env.js");

const config = {
    images: {
        remotePatterns: [
            {
                hostname: "utfs.io",
            },
        ],
    },
    experimental: {
        turbo: {
            rules: {},
        },
        reactCompiler: true,
    },
};

const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
});

const withPlausible = withPlausibleProxy({
    customDomain: "https://plausible.gko.gg",
});

export default withSerwist(withPlausible(config));
