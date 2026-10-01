import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
	title: "Page not found",
	description: "The page you requested could not be found. Return to RCCG Testimony House or contact the church.",
};

export default function NotFound() {
	return (
		<section className="not-found-page page-width" aria-labelledby="not-found-title">
			<p className="section-kicker">404 · PAGE NOT FOUND</p>
			<h1 id="not-found-title">We can’t find that page.</h1>
			<p>The address may have changed or the page may no longer be here. Let’s get you back to the church home page.</p>
			<div className="not-found-page__actions">
				<Link className="pill-button pill-button--purple" href="/"><span><ArrowLeft size={16} /></span> Back to home</Link>
				<Link className="text-arrow" href="/contact">Contact the church <ArrowUpRight size={16} /></Link>
			</div>
		</section>
	);
}