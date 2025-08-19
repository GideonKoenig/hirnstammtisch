// eslint-disable-next-line no-restricted-imports
import { env } from "./src/env.js";

/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: env.SITE_URL,
    generateRobotsTxt: true,
    generateIndexSitemap: true,
    changefreq: "weekly",
    priority: 0.7,
    additionalPaths: async (cfg) => {
        const routes = ["/", "/about", "/calendar"];
        return Promise.all(routes.map((loc) => cfg.transform(cfg, loc)));
    },
    exclude: [
        "/api/*",
        "/profile/*",
        "/admin",
        "/signin",
        "/signup",
        "/events",
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                disallow: [
                    "/api/*",
                    "/profile/*",
                    "/admin",
                    "/signin",
                    "/signup",
                    "/events",
                ],
                allow: ["/", "/about", "/calendar"],
            },
        ],
    },
};

export default config;
