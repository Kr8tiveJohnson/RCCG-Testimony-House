import type { Metadata, Viewport } from "next";
import { AppPrompt } from "../components/app-prompt";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL("https://rccg-testimony-house.vercel.app"),
	title: {
		default: "RCCG Testimony House | A Place to Grow in Faith",
		template: "%s | RCCG Testimony House",
	},
	description:
		"Welcome to RCCG Testimony House. Find a church family, grow in faith, and discover the next step in your journey.",
	manifest: "/manifest.webmanifest",
	appleWebApp: {
		capable: true,
		title: "Testimony House",
		statusBarStyle: "default",
	},
	openGraph: {
		type: "website",
		locale: "en_NG",
		siteName: "RCCG Testimony House",
		title: "RCCG Testimony House | A Place to Grow in Faith",
		description: "Find a church family, grow in faith, and discover the next step in your journey at RCCG Testimony House.",
		url: "/",
		images: [{ url: "/images/welcome%20to%20church.jpg", alt: "Welcome to RCCG Testimony House" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "RCCG Testimony House | A Place to Grow in Faith",
		description: "Find a church family, grow in faith, and discover the next step in your journey.",
		images: ["/images/welcome%20to%20church.jpg"],
	},
	icons: {
		icon: [
			{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		shortcut: "/icons/icon-192.png",
		apple: "/icons/icon-180.png",
	},
};

export const viewport: Viewport = {
	themeColor: "#071d58",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" data-scroll-behavior="smooth">
			<body>
				<SiteHeader />
				<main>{children}</main>
				<SiteFooter />
				<AppPrompt />
			</body>
		</html>
	);
}
