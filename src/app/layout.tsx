import type { Metadata } from "next";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "RCCG Testimony House | A Place to Grow in Faith",
		template: "%s | RCCG Testimony House",
	},
	description:
		"Welcome to RCCG Testimony House. Find a church family, grow in faith, and discover the next step in your journey.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" data-scroll-behavior="smooth">
			<body>
				<SiteHeader />
				<main>{children}</main>
				<SiteFooter />
			</body>
		</html>
	);
}
