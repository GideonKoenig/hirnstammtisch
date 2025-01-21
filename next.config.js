import { withPlausibleProxy } from "next-plausible";
await import("./src/env.js");

const config = {
    images: {
        remotePatterns: [
            {
                hostname: "d5glgttj02.ufs.sh",
            },
        ],
    },
    experimental: {
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.js",
                },
            },
        },
    },
    /**
     * @param {{ module: { rules: any[]; }; }} config
     */
    webpack(config) {
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.(".svg"),
        );

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: {
                    not: [...fileLoaderRule.resourceQuery.not, /url/],
                },
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            svgo: true,
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: "preset-default",
                                        params: {
                                            overrides: {
                                                removeViewBox: false,
                                            },
                                        },
                                    },
                                ],
                            },
                            typescript: true,
                            jsxRuntime: "classic",
                        },
                    },
                ],
            },
        );

        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default withPlausibleProxy({
    customDomain: "https://plausible.gko.gg",
})(config);
