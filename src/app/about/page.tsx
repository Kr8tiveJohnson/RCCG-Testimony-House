import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
	return <ComingSoon eyebrow="OUR STORY" title="A church family growing together." description="We’re preparing the story, vision, and values of RCCG Testimony House. Please check back soon." />;
}
