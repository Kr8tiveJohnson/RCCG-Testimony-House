import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = { title: "Ministries" };

export default function MinistriesPage() {
	return <ComingSoon eyebrow="FIND YOUR PEOPLE" title="There’s a place for you." description="Details about our children, youth, young adult, men, women, music, and outreach ministries are coming soon." />;
}
