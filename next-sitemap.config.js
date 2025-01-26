/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: "https://hirnstammtisch.com",
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    changefreq: "daily",
    priority: 0.7,
    exclude: ["/api/*", "/profile/*"],
    additionalPaths: async () => [
        { loc: "/", priority: 1.0 },
        { loc: "/about", priority: 0.8 },
        { loc: "/calendar", priority: 0.8 },
        { loc: "/events", priority: 0.9 },
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                disallow: ["/api/*", "/profile/*"],
                allow: "/",
            },
        ],
    },
};

export default config;
