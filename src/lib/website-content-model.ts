import { BookOpen, HeartHandshake, Music2, Users, UsersRound, type LucideIcon } from "lucide-react";
import { ministries as ministryDefaults, serviceInformation } from "../data/site-content";

export type MinistryContent = {
	name: string;
	slug: string;
	description: string;
	heading: string;
	story: string;
	image?: string;
};

export type EventContent = {
	title: string;
	image?: string;
	date: string;
	time: string;
	organizer: string;
	theme: string;
	scripture: string;
	caseStudy: string;
	featuring: string[];
	location: string;
	description: string;
};

export type SermonContent = {
	date: string;
	image?: string;
	title: string;
	service: string;
	speaker: string;
	topic: string;
	scriptures: string[];
	summary: string;
	points: string[];
	prayerPoints: string[];
};

export type WebsiteContent = {
	pages: {
		homeHeading: string;
		homeDescription: string;
		welcomeHeading: string;
		welcomeDescription: string;
		sermonDescription: string;
	};
	services: {
		day: string;
		schedule: { label: string; time: string }[];
		address: string;
	};
	ministries: MinistryContent[];
	events: EventContent[];
	sermons: SermonContent[];
};

const ministryIcons: Record<string, LucideIcon> = {
	children: UsersRound,
	"teens-youth": UsersRound,
	"young-adults": Users,
	"men-women": HeartHandshake,
	"choir-music": Music2,
	"evangelism-media": BookOpen,
};

export function getMinistryIcon(slug: string) {
	return ministryIcons[slug] ?? UsersRound;
}

export function formatEventDate(date: string) {
	return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
	}).toUpperCase();
}

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
	pages: {
		homeHeading: "WELCOME TO TESTIMONY HOUSE",
		homeDescription: "Experience God’s love in a welcoming church family where faith grows, hope is renewed, and every story matters.",
		welcomeHeading: "There’s a place for your story.",
		welcomeDescription: "We are a church family learning to follow Jesus, care for one another, and make room for every generation to grow. If you’re exploring faith or looking for a place to belong, we’d love to welcome you.",
		sermonDescription: "Sermons and teaching from RCCG Testimony House.",
	},
	services: serviceInformation,
	ministries: ministryDefaults.map(({ name, slug, description, heading, story, image }) => ({
		name,
		slug,
		description,
		heading,
		story,
		...(image ? { image } : {}),
	})),
	events: [],
	sermons: [],
};

export function isWebsiteContent(value: unknown): value is WebsiteContent {
	if (!value || typeof value !== "object") return false;
	const content = value as Partial<WebsiteContent>;
	const isText = (item: unknown, maximumLength: number) =>
		typeof item === "string" && item.length <= maximumLength;
	const isTextList = (items: unknown, maximumItems = 100) =>
		Array.isArray(items) && items.length <= maximumItems && items.every((item) => isText(item, 5000));
	const isImageReference = (image: unknown) =>
		image === undefined || image === "" || (typeof image === "string" && image.length <= 80 && /^\/api\/media\/[0-9a-f-]{36}$/i.test(image));

	if (!content.pages || !content.services || !Array.isArray(content.ministries) ||
		!Array.isArray(content.events) || !Array.isArray(content.sermons)) return false;
	if (!isText(content.pages.homeHeading, 200) || !isText(content.pages.homeDescription, 3000) ||
		!isText(content.pages.welcomeHeading, 300) || !isText(content.pages.welcomeDescription, 5000) ||
		!isText(content.pages.sermonDescription, 3000)) return false;
	if (!isText(content.services.day, 100) || !isText(content.services.address, 1000) ||
		!Array.isArray(content.services.schedule) || content.services.schedule.length > 20 ||
		!content.services.schedule.every((item) => item && isText(item.label, 200) && isText(item.time, 100))) return false;
	if (content.ministries.length > 100 || !content.ministries.every((item) =>
		item && isText(item.name, 200) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) &&
		isText(item.description, 1000) && isText(item.heading, 500) && isText(item.story, 5000) &&
		(item.image === undefined || isText(item.image, 1000)))) return false;
	if (new Set(content.ministries.map((item) => item.slug)).size !== content.ministries.length) return false;
	if (content.events.length > 100 || !content.events.every((item) =>
		item && isText(item.title, 200) && isImageReference(item.image) && /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
		isText(item.time, 100) && isText(item.organizer, 500) && isText(item.theme, 300) &&
		isText(item.scripture, 300) && isText(item.caseStudy, 300) &&
		isTextList(item.featuring, 20) && isText(item.location, 500) &&
		isText(item.description, 3000))) return false;
	if (content.sermons.length > 100 || !content.sermons.every((item) =>
		item && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && isImageReference(item.image) && isText(item.title, 200) && isText(item.service, 100) &&
		isText(item.speaker, 200) && isText(item.topic, 300) &&
		isTextList(item.scriptures, 30) && isText(item.summary, 5000) &&
		isTextList(item.points) && isTextList(item.prayerPoints))) return false;
	return true;
}
