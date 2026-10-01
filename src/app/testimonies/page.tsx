import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = {
	title: "Church testimonies",
	description: "Read stories of faith, hope, and new beginnings from the RCCG Testimony House church family.",
};

export default function TestimoniesPage() {
	return <ComingSoon eyebrow="GOD IS STILL WRITING" title="Your story matters." description="Read the testimonies of our church family and learn how to share your own story soon." />;
}
