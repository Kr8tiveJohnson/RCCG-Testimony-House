import { NextResponse } from "next/server";
import { isSameOriginRequest, isValidAdminSessionToken } from "../../../../../lib/admin-session";
import { sendPushToSubscribers } from "../../../../../lib/web-push";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
	return isValidAdminSessionToken(
		request.headers.get("cookie")?.match(/(?:^|;\s*)rccg_admin_session=([^;]+)/)?.[1],
	);
}

export async function POST(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Broadcast request was rejected." }, { status: 403 });
	}
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Sign in to send notifications." }, { status: 401 });
	}

	let body: { title?: unknown; body?: unknown; url?: unknown };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ success: false, error: "Invalid notification content." }, { status: 400 });
	}

	if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 200) {
		return NextResponse.json({ success: false, error: "Provide a valid notification title." }, { status: 400 });
	}
	if (typeof body.body !== "string" || !body.body.trim() || body.body.length > 2000) {
		return NextResponse.json({ success: false, error: "Provide a valid notification message." }, { status: 400 });
	}
	const url = typeof body.url === "string" && body.url.startsWith("/") ? body.url : "/events";

	try {
		const result = await sendPushToSubscribers({
			title: body.title.trim(),
			body: body.body.trim(),
			url,
		});

		return NextResponse.json({
			success: true,
			sent: result.sent,
			failed: result.failed,
			warning: result.warning,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not send broadcast notification.";
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}
