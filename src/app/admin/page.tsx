import type { Metadata } from "next";
import { AdminDashboard } from "../../components/admin-dashboard";

export const metadata: Metadata = {
	title: "Website admin",
	description: "Preview dashboard for RCCG Testimony House website content and analytics.",
	robots: { index: false, follow: false },
};

export default function AdminPage() {
	return <AdminDashboard />;
}