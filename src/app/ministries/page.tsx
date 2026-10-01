import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";
import { ministries } from "../../data/site-content";

export const metadata: Metadata = {
	title: "Church ministries",
	description: "Explore children, youth, young adult, music, outreach, and other ministries at RCCG Testimony House.",
};

export default function MinistriesPage() {
	return (
		<section className="ministries-page page-width">
			<div className="ministry-detail__actions ministries-page__actions">
				<span />
				<Link href="/" className="pill-button pill-button--purple ministry-detail__home">
					<span><Home size={15} /></span> Home
				</Link>
			</div>

			<div className="section-intro ministries-page__intro">
				<p className="section-kicker">FIND YOUR PEOPLE</p>
				<h2>There’s a place for <em>you.</em></h2>
			</div>

			<div className="ministry-tiles">
				{ministries.map((ministry, index) => {
					const artStyle = ministry.image ? ({ ["--tile-image" as string]: `url(${ministry.image})` } as const) : undefined;

					return (
						<Link key={ministry.slug} href={`/ministries/${ministry.slug}`} className="ministry-tile__link">
							<div className="ministry-tile__art" style={artStyle}>
								<span>{String(index + 1).padStart(2, "0")}</span>
							</div>
							<div className="ministry-tile__bottom">
								<div>
									<h3>{ministry.name}</h3>
									<p>{ministry.description}</p>
								</div>
								<ArrowUpRight size={19} />
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
