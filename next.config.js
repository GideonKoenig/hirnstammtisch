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
};

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

const withPlausible = withPlausibleProxy({
    customDomain: "https://plausible.gko.gg",
});

export default withSerwist(withPlausible(config));
