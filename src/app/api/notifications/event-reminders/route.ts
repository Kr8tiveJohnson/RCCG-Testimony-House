import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getWebsiteContent } from "../../../../lib/website-content";
import { sendPushToSubscribers } from "../../../../lib/web-push";

export const runtime = "nodejs";

function tomorrowInLagos() {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Africa/Lagos",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(new Date());
	const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	const today = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) + 1));
	return today.toISOString().slice(0, 10);
}

function isAuthorized(request: Request) {
	const secret = process.env.CRON_SECRET;
	const authorization = request.headers.get("authorization");
	if (!secret || !authorization?.startsWith("Bearer ")) return false;
	const supplied = Buffer.from(authorization.slice(7));
	const expected = Buffer.from(secret);
	return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function GET(request: Request) {
	if (!process.env.CRON_SECRET) {
		return NextResponse.json({ success: false, error: "CRON_SECRET is not configured." }, { status: 503 });
	}
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Scheduled notification request was rejected." }, { status: 401 });
	}

	try {
		const { events } = await getWebsiteContent();
		const tomorrow = tomorrowInLagos();
		const reminders = events.filter((event) => event.date === tomorrow);
		const results = [];

		for (const event of reminders) {
			const key = createHash("sha256").update(`event-reminder:${event.date}:${event.title}`).digest("hex");
			results.push(await sendPushToSubscribers({
				title: `Tomorrow: ${event.title}`,
				body: [event.time, event.theme].filter(Boolean).join(" · ") || "Join us at RCCG Testimony House.",
				url: "/events",
			}, key));
		}

		return NextResponse.json({
			success: true,
			date: tomorrow,
			events: reminders.length,
			sent: results.reduce((total, result) => total + result.sent, 0),
			failed: results.reduce((total, result) => total + result.failed, 0),
			warnings: results.map((result) => result.warning).filter(Boolean),
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not send event reminders.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}
