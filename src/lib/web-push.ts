import "server-only";
import webpush, { type PushSubscription } from "web-push";
import { getPostgresPool, isPostgresConfigured } from "./postgres";
import type { EventContent, SermonContent } from "./website-content-model";

type StoredSubscription = {
	id: string;
	subscription: PushSubscription;
};

type NotificationPayload = {
	title: string;
	body: string;
	url: string;
};

type DeliveryResult = {
	sent: number;
	failed: number;
	warning?: string;
};

function vapidSettings() {
	const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
	const privateKey = process.env.VAPID_PRIVATE_KEY;
	const subject = process.env.VAPID_SUBJECT;
	if (!publicKey || !privateKey || !subject) return null;
	webpush.setVapidDetails(subject, publicKey, privateKey);
	return { publicKey };
}

export function getPushPublicKey() {
	return vapidSettings()?.publicKey ?? null;
}

function isExpiredSubscription(error: unknown) {
	if (!error || typeof error !== "object" || !("statusCode" in error)) return false;
	return error.statusCode === 404 || error.statusCode === 410;
}

export async function sendPushToSubscribers(
	payload: NotificationPayload,
	notificationKey?: string,
): Promise<DeliveryResult> {
	if (!vapidSettings()) {
		return { sent: 0, failed: 0, warning: "Push notifications are not configured on the server yet." };
	}

	if (!isPostgresConfigured()) {
		return { sent: 0, failed: 0, warning: "Database is not configured for push notifications." };
	}

	let result: { rows: StoredSubscription[] };
	let pool: ReturnType<typeof getPostgresPool>;
	try {
		pool = getPostgresPool();
		result = await pool.query<StoredSubscription>(
			"SELECT id, subscription FROM push_subscriptions ORDER BY created_at",
		);
	} catch (error) {
		console.warn("Could not query push subscriptions from database:", error);
		return { sent: 0, failed: 0, warning: "Could not query push subscriptions from the database." };
	}

	let sent = 0;
	let failed = 0;

	for (const subscriber of result.rows) {
		if (notificationKey) {
			const claimed = await pool.query(
				`INSERT INTO push_notification_deliveries (notification_key, subscription_id)
				 VALUES ($1, $2)
				 ON CONFLICT DO NOTHING
				 RETURNING subscription_id`,
				[notificationKey, subscriber.id],
			);
			if (!claimed.rowCount) continue;
		}

		try {
			await webpush.sendNotification(subscriber.subscription, JSON.stringify(payload), { TTL: 60 * 60 });
			sent += 1;
		} catch (error) {
			failed += 1;
			if (notificationKey) {
				await pool.query(
					"DELETE FROM push_notification_deliveries WHERE notification_key = $1 AND subscription_id = $2",
					[notificationKey, subscriber.id],
				);
			}
			if (isExpiredSubscription(error)) {
				await pool.query("DELETE FROM push_subscriptions WHERE id = $1", [subscriber.id]);
			} else {
				console.error("Could not send a church push notification.", error);
			}
		}
	}

	return {
		sent,
		failed,
		...(failed ? { warning: `Notification delivery failed for ${failed} subscriber${failed === 1 ? "" : "s"}.` } : {}),
	};
}

function sermonKey(sermon: SermonContent) {
	return `${sermon.date}\u0000${sermon.service}\u0000${sermon.title}`;
}

export async function notifyNewSermons(previous: SermonContent[], current: SermonContent[]) {
	const existing = new Set(previous.map(sermonKey));
	const published = current.filter((sermon) => !existing.has(sermonKey(sermon)));
	const outcomes: DeliveryResult[] = [];

	for (const sermon of published) {
		outcomes.push(await sendPushToSubscribers({
			title: `New sermon: ${sermon.title}`,
			body: `${sermon.speaker} · ${sermon.service}`,
			url: "/sermons",
		}));
	}

	const warning = outcomes.find((outcome) => outcome.warning)?.warning;
	return { published: published.length, warning };
}

function eventKey(event: EventContent) {
	return `${event.date}\u0000${event.title}`;
}

export async function notifyNewEvents(previous: EventContent[], current: EventContent[]) {
	const existing = new Set(previous.map(eventKey));
	const published = current.filter((event) => !existing.has(eventKey(event)));
	const outcomes: DeliveryResult[] = [];

	for (const event of published) {
		const descriptionSummary = event.description?.split("\n")[0]?.trim();
		outcomes.push(await sendPushToSubscribers({
			title: `Upcoming event: ${event.title}`,
			body: descriptionSummary || [event.time, event.theme].filter(Boolean).join(" · ") || "Join us at RCCG Testimony House.",
			url: "/events",
		}));
	}

	const warning = outcomes.find((outcome) => outcome.warning)?.warning;
	return { published: published.length, warning };
}
