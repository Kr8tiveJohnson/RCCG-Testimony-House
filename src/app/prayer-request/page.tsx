import type { Metadata } from "next";
import { ComingSoon } from "../../components/coming-soon";

export const metadata: Metadata = {
	title: "Prayer request",
	description: "Request prayer from RCCG Testimony House. Until the private prayer form is available, contact the church directly.",
};

export default function PrayerRequestPage() {
	return <ComingSoon eyebrow="WE’RE HERE FOR YOU" title="Can we pray with you?" description="Our private prayer request form is being prepared. For now, please reach out through the contact page." />;
}
