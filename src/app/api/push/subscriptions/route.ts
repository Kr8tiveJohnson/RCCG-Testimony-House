import { NextResponse } from "next/server";
import { isSameOriginRequest } from "../../../../lib/admin-session";
import { getPostgresPool, isPostgresConfigured } from "../../../../lib/postgres";

export const runtime = "nodejs";

const CREATE_TABLE_QUERY = `
	CREATE TABLE IF NOT EXISTS push_subscriptions (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		endpoint TEXT NOT NULL UNIQUE,
		subscription JSONB NOT NULL CHECK (jsonb_typeof(subscription) = 'object'),
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);
`;

function isAllowedPushEndpoint(value: unknown): value is string {
	if (typeof value !== "string" || value.length > 4096) return false;
	try {
		const endpoint = new URL(value);
		const hostname = endpoint.hostname.toLowerCase();
		const supportedProvider =
			hostname === "fcm.googleapis.com" ||
			hostname === "web.push.apple.com" ||
			hostname.endsWith(".push.services.mozilla.com") ||
			hostname === "push.services.mozilla.com" ||
			hostname.endsWith(".push.services.mozilla.net") ||
			hostname === "push.services.mozilla.net" ||
			hostname.endsWith(".notify.windows.com");
		return endpoint.protocol === "https:" && supportedProvider;
	} catch {
		return false;
	}
}

function validSubscription(value: unknown): value is {
	endpoint: string;
	keys: { auth: string; p256dh: string };
} {
	if (!value || typeof value !== "object") return false;
	const subscription = value as { endpoint?: unknown; keys?: { auth?: unknown; p256dh?: unknown } };
	return isAllowedPushEndpoint(subscription.endpoint) &&
		typeof subscription.keys?.auth === "string" && subscription.keys.auth.length > 0 && subscription.keys.auth.length <= 256 &&
		typeof subscription.keys?.p256dh === "string" && subscription.keys.p256dh.length > 0 && subscription.keys.p256dh.length <= 256;
}

export async function POST(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Notification subscription request was rejected." }, { status: 403 });
	}

	let subscription: unknown;
	try {
		subscription = await request.json();
	} catch {
		return NextResponse.json({ success: false, error: "Choose valid notification settings and try again." }, { status: 400 });
	}
	if (!validSubscription(subscription)) {
		return NextResponse.json({ success: false, error: "The browser returned invalid notification settings." }, { status: 400 });
	}

	if (!isPostgresConfigured()) {
		return NextResponse.json({ success: false, error: "Push subscriptions are currently unavailable." }, { status: 503 });
	}

	try {
		const pool = getPostgresPool();
		await pool.query(CREATE_TABLE_QUERY);
		await pool.query(
			`INSERT INTO push_subscriptions (endpoint, subscription)
			 VALUES ($1, $2::jsonb)
			 ON CONFLICT (endpoint) DO UPDATE
			 SET subscription = EXCLUDED.subscription, updated_at = NOW()`,
			[subscription.endpoint, JSON.stringify(subscription)],
		);
		return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not save notification settings.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}

export async function DELETE(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Notification subscription request was rejected." }, { status: 403 });
	}

	let body: { endpoint?: unknown };
	try {
		body = await request.json() as { endpoint?: unknown };
	} catch {
		return NextResponse.json({ success: false, error: "Choose valid notification settings and try again." }, { status: 400 });
	}
	if (!isAllowedPushEndpoint(body.endpoint)) {
		return NextResponse.json({ success: false, error: "The browser returned invalid notification settings." }, { status: 400 });
	}

	if (!isPostgresConfigured()) {
		return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
	}

	try {
		await getPostgresPool().query("DELETE FROM push_subscriptions WHERE endpoint = $1", [body.endpoint]);
		return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not remove notification settings.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}
