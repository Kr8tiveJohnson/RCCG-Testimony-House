import Image from "next/image";
import type { EventContent } from "../lib/website-content-model";

export function EventDetails({ event, showImage = true, showQuickFacts = false }: { event: EventContent; showImage?: boolean; showQuickFacts?: boolean }) {
	return (
		<div className="event-details">
			{showImage && event.image ? <div className="event-details__image-frame"><Image className="event-details__image" src={event.image} alt={`${event.title} flyer`} width={960} height={540} unoptimized /></div> : null}
			{event.organizer ? <p className="event-details__organizer">{event.organizer}</p> : null}
			<div className="event-details__facts">
				{event.theme ? <p><strong>Theme</strong><span>{event.theme}</span></p> : null}
				{event.scripture ? <p><strong>Scripture</strong><span>{event.scripture}</span></p> : null}
				{event.caseStudy ? <p><strong>Case study</strong><span>{event.caseStudy}</span></p> : null}
				{!showQuickFacts && event.time ? <p><strong>Time</strong><span>{event.time}</span></p> : null}
				{!showQuickFacts && event.location ? <p><strong>Location</strong><span>{event.location}</span></p> : null}
			</div>
			{event.description ? <p className="event-details__description">{event.description}</p> : null}
			{event.featuring.length ? <div className="event-details__featuring"><strong>Join us for</strong><ul>{event.featuring.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
		</div>
	);
}
