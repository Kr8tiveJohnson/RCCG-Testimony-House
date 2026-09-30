import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = { title: "Sermons" };

export default function SermonsPage() {
	return <ComingSoon eyebrow="THE MESSAGE" title="A word for your journey." description="Sermons and teaching from RCCG Testimony House will be available here soon." />;
}
