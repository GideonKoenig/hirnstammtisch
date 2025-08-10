/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: "https://hirnstammtisch.com",
    generateRobotsTxt: true,
    generateIndexSitemap: true,
    changefreq: "daily",
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
                allow: "/",
            },
        ],
    },
};

export default config;
