/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
    siteUrl: "https://hirnstammtisch.com",
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                disallow: [],
            },
        ],
    },
};

export default sitemapConfig;
