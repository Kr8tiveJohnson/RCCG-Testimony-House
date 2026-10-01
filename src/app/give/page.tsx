import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = {
	title: "Give",
	description: "Learn how to support the work and community of RCCG Testimony House. Approved giving details will be shared here.",
};

export default function GivePage() {
	return <ComingSoon eyebrow="GIVE WITH PURPOSE" title="Thank you for your generosity." description="Giving information will be published after the church’s approved payment and bank details are confirmed." />;
}
