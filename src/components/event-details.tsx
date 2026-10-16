import Image from "next/image";
import { UserCheck } from "lucide-react";
import type { EventContent } from "../lib/website-content-model";

function parseEventDescription(description?: string) {
	if (!description) return { summary: "", ministers: [] };
	const parts = description.split(/(?:\r?\n\s*)+Ministers:\s*(?:\r?\n)+/i);
	if (parts.length > 1) {
		const summary = parts[0].trim();
		const ministers = parts[1]
			.split(/\r?\n/)
			.map((m) => m.replace(/^[•\-\*]\s*/, "").trim())
			.filter(Boolean);
		return { summary, ministers };
	}
	return { summary: description.trim(), ministers: [] };
}

export function EventDetails({
	event,
	showImage = true,
	showQuickFacts = false,
}: {
	event: EventContent;
	showImage?: boolean;
	showQuickFacts?: boolean;
}) {
	const { summary, ministers } = parseEventDescription(event.description);

	return (
		<div className="event-details">
			{showImage && event.image ? (
				<div className="event-details__image-frame">
					<Image
						className="event-details__image"
						src={event.image}
						alt={`${event.title} flyer`}
						width={960}
						height={540}
						unoptimized
					/>
				</div>
			) : null}
			{event.organizer ? <p className="event-details__organizer">{event.organizer}</p> : null}
			<div className="event-details__facts">
				{event.theme ? (
					<p>
						<strong>Theme</strong>
						<span>{event.theme}</span>
					</p>
				) : null}
				{event.scripture ? (
					<p>
						<strong>Scripture</strong>
						<span>{event.scripture}</span>
					</p>
				) : null}
				{event.caseStudy ? (
					<p>
						<strong>Case study</strong>
						<span>{event.caseStudy}</span>
					</p>
				) : null}
				{!showQuickFacts && event.time ? (
					<p>
						<strong>Time</strong>
						<span>{event.time}</span>
					</p>
				) : null}
				{!showQuickFacts && event.location ? (
					<p>
						<strong>Location</strong>
						<span>{event.location}</span>
					</p>
				) : null}
			</div>

			{summary ? (
				<div className="event-details__summary">
					<p>{summary}</p>
				</div>
			) : null}

			{ministers.length ? (
				<div className="event-details__ministers">
					<strong>Ministers & Leadership</strong>
					<ul className="event-details__ministers-list">
						{ministers.map((minister) => {
							const match = minister.match(/^(.+?)\s*\((.+?)\)$/);
							if (match) {
								return (
									<li key={minister}>
										<UserCheck size={14} className="event-details__minister-icon" />
										<span className="event-details__minister-name">{match[1]}</span>
										<span className="event-details__minister-role">{match[2]}</span>
									</li>
								);
							}
							return (
								<li key={minister}>
									<UserCheck size={14} className="event-details__minister-icon" />
									<span className="event-details__minister-name">{minister}</span>
								</li>
							);
						})}
					</ul>
				</div>
			) : null}

			{event.featuring.length ? (
				<div className="event-details__featuring">
					<strong>Join us for</strong>
					<ul>
						{event.featuring.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}
