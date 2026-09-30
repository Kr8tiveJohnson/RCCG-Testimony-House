import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = { title: "Prayer request" };

export default function PrayerRequestPage() {
	return <ComingSoon eyebrow="WE’RE HERE FOR YOU" title="Can we pray with you?" description="Our private prayer request form is being prepared. For now, please reach out through the contact page." />;
}
