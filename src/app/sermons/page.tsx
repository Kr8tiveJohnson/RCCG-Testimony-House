import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Heart, Mic2 } from "lucide-react";
import { getWebsiteContent } from "../../lib/website-content";

export const metadata: Metadata = {
	title: "Sermons and teaching",
	description: "Watch and revisit sermons and Bible teaching from RCCG Testimony House in Lagos.",
};

export const dynamic = "force-dynamic";

export default async function SermonsPage() {
	const { sermons, pages } = await getWebsiteContent();
	return (
		<section className="sermons-page page-width">
			<header className="sermons-page__heading">
				<p className="section-kicker">THE MESSAGE</p>
				<h1>A word for <em>your journey.</em></h1>
				<p>{pages.sermonDescription}</p>
			</header>
			{sermons.length ? <div className="sermon-list">
				{sermons.map((sermon) => (
					<article className="sermon-notes" key={`${sermon.service}-${sermon.title}`}>
						<aside className="sermon-notes__poster">
							{sermon.image ? <Image className="sermon-notes__image" src={sermon.image} alt={`${sermon.title} sermon`} width={1200} height={675} unoptimized /> : <div className="sermon-notes__poster-placeholder"><BookOpen size={36} /><span>THE MESSAGE</span></div>}
							<span className="sermon-notes__date">{new Date(`${sermon.date}T12:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
						</aside>
						<div className="sermon-notes__content">
							<div className="sermon-notes__heading">
								<p className="sermon-notes__service">{sermon.service}</p>
								<h2>{sermon.title}</h2>
								<p className="sermon-notes__speaker"><Mic2 size={15} /> {sermon.speaker}</p>
							</div>
							<p className="sermon-notes__topic"><strong>Topic</strong><span>{sermon.topic}</span></p>
							{sermon.scriptures.length ? <div className="sermon-notes__scriptures"><strong>Scripture</strong><div>{sermon.scriptures.map((scripture) => <span key={scripture}>{scripture}</span>)}</div></div> : null}
							<div className="sermon-notes__summary"><p className="sermon-notes__label">SERMON SUMMARY</p><p>{sermon.summary}</p></div>
							{sermon.points.length ? <div className="sermon-notes__section"><h3>Sermon notes</h3><ol>{sermon.points.map((point) => <li key={point}>{point}</li>)}</ol></div> : null}
							{sermon.prayerPoints.length ? <div className="sermon-notes__prayer"><h3><Heart size={16} /> Prayer points</h3><ol>{sermon.prayerPoints.map((point) => <li key={point}>{point}</li>)}</ol></div> : null}
						</div>
					</article>
				))}
			</div> : <p>Sermons and teaching will be shared here soon.</p>}
		</section>
	);
}
