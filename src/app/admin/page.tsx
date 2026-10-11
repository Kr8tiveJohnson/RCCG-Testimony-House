import type { Metadata } from "next";
import { AdminDashboard } from "../../components/admin-dashboard";
import { AdminLogin } from "../../components/admin-login";
import { adminPasswordConfigured, hasAdminSession } from "../../lib/admin-session";

export const metadata: Metadata = {
	title: "Website admin",
	description: "Private RCCG Testimony House website administration.",
	robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
	if (!adminPasswordConfigured()) return <AdminLogin configurationRequired />;
	const authenticated = await hasAdminSession();
	return authenticated ? <AdminDashboard /> : <AdminLogin />;
}