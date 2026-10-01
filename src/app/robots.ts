import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const siteUrl = "https://rccg-testimony-house.vercel.app";

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/admin/",
		},
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}