import type { MetadataRoute } from "next";
import { ministries } from "../data/site-content";

const siteUrl = "https://rccg-testimony-house.vercel.app";
const staticRoutes = [
	"",
	"/about",
	"/contact",
	"/events",
	"/give",
	"/livestream",
	"/ministries",
	"/prayer-request",
	"/register",
	"/sermons",
	"/testimonies",
	"/privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...staticRoutes.map((route) => ({
			url: `${siteUrl}${route}`,
			changeFrequency: "monthly" as const,
			priority: route === "" ? 1 : 0.6,
		})),
		...ministries.map((ministry) => ({
			url: `${siteUrl}/ministries/${ministry.slug}`,
			changeFrequency: "monthly" as const,
			priority: 0.5,
		})),
	];
}