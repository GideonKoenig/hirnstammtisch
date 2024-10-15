/* eslint-disable */

import { withPlausibleProxy } from "next-plausible";

await import("./src/env.js");

/**
 * @typedef {import('webpack').RuleSetRule} RuleSetRule
 * @typedef {import('webpack').Configuration} WebpackConfig
 */

/**
 * Type guard to check if a rule is a RuleSetRule that tests for ".svg"
 * @param {false | "" | 0 | RuleSetRule | "..." | null | undefined} rule
 * @returns {rule is RuleSetRule}
 */
function isSvgRule(rule) {
    return (
        typeof rule === "object" &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg")
    );
}

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
const config = {
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
    webpack(
        /**
         * @type {import('webpack').Configuration}
         */ config,
    ) {
        const fileLoaderRule = config.module?.rules?.find(
            (rule) =>
                typeof rule === "object" &&
                rule !== null &&
                rule.test instanceof RegExp &&
                rule.test.test(".svg"),
        );

        if (isSvgRule(fileLoaderRule)) {
            config.module?.rules?.push(
                {
                    ...fileLoaderRule,
                    test: /\.svg$/i,
                    resourceQuery: /url/,
                },
                {
                    test: /\.svg$/i,
                    issuer: fileLoaderRule.issuer,
                    resourceQuery: {
                        // @ts-ignore
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
        }
        return config;
    },
};

export default withPlausibleProxy({
    customDomain: "https://plausible.dnd-platform.com",
})(config);
