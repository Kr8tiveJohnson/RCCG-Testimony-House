import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { notFound } from "next/navigation";
import { ministries } from "../../../data/site-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const ministry = ministries.find((item) => item.slug === slug);

	return {
		title: ministry ? `${ministry.name} | RCCG Testimony House` : "Ministry",
	};
}

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const ministry = ministries.find((item) => item.slug === slug);

	if (!ministry) {
		notFound();
	}

	return (
		<section className="ministry-detail page-width">
			<div className="ministry-detail__actions">
				<Link href="/ministries" className="text-arrow ministry-detail__back">
					<ArrowLeft size={16} /> Back to ministries
				</Link>
				<Link href="/" className="pill-button pill-button--purple ministry-detail__home">
					<span><Home size={15} /></span> Home
				</Link>
			</div>

			<div
				className="ministry-detail__hero"
				style={
					ministry.image
						? ({ ["--ministry-image" as string]: `url(${ministry.image})` } as const)
						: undefined
				}
			>
				<div className="ministry-detail__overlay">
					<p className="section-kicker section-kicker--light">{ministry.name}</p>
					<h1>{ministry.heading}</h1>
				</div>
			</div>

			<div className="ministry-detail__content">
				<p>{ministry.story}</p>
				<Link href="/" className="pill-button pill-button--outline ministry-detail__cta">
					Go to home <span><ArrowRight size={16} /></span>
				</Link>
			</div>
		</section>
	);
}
