/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: "https://hirnstammtisch.com",
    generateRobotsTxt: true,
    generateIndexSitemap: true,
    changefreq: "daily",
    priority: 0.7,
    exclude: ["/api/*", "/profile/*"],
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
