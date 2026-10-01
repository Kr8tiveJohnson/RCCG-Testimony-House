import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy policy",
	description: "Read how RCCG Testimony House handles information shared through this website and its contact links.",
};

export default function PrivacyPolicyPage() {
	return (
		<article className="privacy-page page-width">
			<p className="section-kicker">YOUR INFORMATION</p>
			<h1>Privacy policy</h1>
			<p className="privacy-page__updated">Last updated October 2, 2026</p>
			<p>RCCG Testimony House respects your privacy. This notice explains what happens when you visit this website and how to contact us with questions.</p>

			<h2>Information shared through this website</h2>
			<p>The membership form currently displayed on this website is a preview only. Submissions are not sent to the church or stored by this website. The site does not currently provide accounts, analytics tracking, or an online prayer-request form.</p>
			<p>If you choose to email or call the church, the information you share is handled through your email, phone, or messaging provider and may be retained by that provider.</p>

			<h2>Hosting and external links</h2>
			<p>The website hosting provider may process basic technical information, such as server logs, to deliver and protect the site. Links to social media and other third-party services are governed by those services’ own privacy notices.</p>

			<h2>How to contact us</h2>
			<p>For privacy questions, email <a href="mailto:rccglp103@gmail.com">rccglp103@gmail.com</a> or use our <Link href="/contact">contact page</Link>.</p>
			<p>This policy will be updated before the website begins collecting or storing information through online forms.</p>
		</article>
	);
}