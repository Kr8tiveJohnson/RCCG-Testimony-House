import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = {
	title: "Church events",
	description: "Find upcoming gatherings, programmes, and community events at RCCG Testimony House in Lagos.",
};

export default function EventsPage() {
	return <ComingSoon eyebrow="LIFE TOGETHER" title="Make room for what’s next." description="Upcoming gatherings and event details will be shared here once confirmed." />;
}
