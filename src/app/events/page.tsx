import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { EventDetails } from "../../components/event-details";
import { getWebsiteContent } from "../../lib/website-content";
import { formatEventDate } from "../../lib/website-content-model";

export const metadata: Metadata = {
	title: "Church events",
	description: "Find upcoming gatherings, programmes, and community events at RCCG Testimony House in Lagos.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
	const { events } = await getWebsiteContent();
	return (
		<section className="events-page page-width">
			<header className="events-page__heading">
				<p className="section-kicker">LIFE TOGETHER</p>
				<h1>Make room for <em>what’s next.</em></h1>
				<p>Gather with our church family at an upcoming event.</p>
			</header>
			{events.length ? <div className="events-page__list">{events.map((event) => (
				<article className="event-card" key={`${event.date}-${event.title}`}>
					<div className="event-card__poster">
						{event.image ? <Image src={event.image} alt={`${event.title} event flyer`} width={900} height={1200} unoptimized /> : <div className="event-card__poster-placeholder"><CalendarDays size={38} /><span>{formatEventDate(event.date)}</span><strong>{event.title}</strong></div>}
					</div>
					<div className="event-card__content">
						<p className="event-card__eyebrow">UPCOMING GATHERING <span aria-hidden="true">·</span> {formatEventDate(event.date)}</p>
						<h2>{event.title}</h2>
						<div className="event-card__quick-facts">
							{event.time ? <span><Clock3 size={15} />{event.time}</span> : null}
							{event.location ? <span><MapPin size={15} />{event.location}</span> : null}
						</div>
						<EventDetails event={event} showImage={false} showQuickFacts />
					</div>
				</article>
			))}</div> : <p>No upcoming events have been announced yet.</p>}
		</section>
	);
}
