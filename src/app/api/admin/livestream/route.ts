import { NextResponse } from "next/server";
import { isSameOriginRequest, isValidAdminSessionToken } from "../../../../lib/admin-session";
import { getLivestreamSettings, saveLivestreamSettings } from "../../../../lib/livestream-store";
import { isLivestreamSettings } from "../../../../lib/livestream";
import { sendPushToSubscribers } from "../../../../lib/web-push";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
	return isValidAdminSessionToken(request.headers.get("cookie")?.match(/(?:^|;\s*)rccg_admin_session=([^;]+)/)?.[1]);
}

export async function GET(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Sign in to manage livestream settings." }, { status: 401 });
	}

	try {
		const settings = await getLivestreamSettings();
		return NextResponse.json({ success: true, settings }, { headers: { "Cache-Control": "no-store" } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not load livestream settings.";
		return NextResponse.json({ success: false, error: message }, { status: 502 });
	}
}

export async function POST(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Livestream update request was rejected." }, { status: 403 });
	}
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Sign in to manage livestream settings." }, { status: 401 });
	}

	let settings: unknown;
	try {
		settings = await request.json();
	} catch {
		return NextResponse.json({ success: false, error: "Enter a valid livestream link." }, { status: 400 });
	}

	if (!isLivestreamSettings(settings)) {
		return NextResponse.json({
			success: false,
			error: "Enter a valid YouTube video/live URL or a public Facebook video/live URL.",
		}, { status: 400 });
	}

	try {
		const previousSettings = await getLivestreamSettings();
		const savedSettings = await saveLivestreamSettings(settings);
		let notificationWarning: string | undefined;
		let notificationNotice: string | undefined;
		const wentLive = !previousSettings.isLive && savedSettings.isLive;
		const liveStreamChanged = savedSettings.isLive &&
			(previousSettings.platform !== savedSettings.platform || previousSettings.url !== savedSettings.url);

		if (wentLive || liveStreamChanged) {
			try {
				const result = await sendPushToSubscribers({
					title: "We’re live now!",
					body: `Join RCCG Testimony House on ${savedSettings.platform === "youtube" ? "YouTube" : "Facebook"} now.`,
					url: "/livestream",
				});
				notificationWarning = result.warning;
				notificationNotice = result.warning
					? `Livestream saved and marked live. ${result.warning}`
					: `Livestream saved and marked live. Notified ${result.sent} subscriber${result.sent === 1 ? "" : "s"}.`;
			} catch (error) {
				notificationWarning = error instanceof Error ? error.message : "Push notifications could not be sent.";
				notificationNotice = `Livestream saved and marked live, but notification delivery failed: ${notificationWarning}`;
				console.error("Livestream was updated but push notifications failed.", error);
			}
		} else {
			notificationNotice = savedSettings.isLive
				? "Livestream link saved. The stream is marked live; subscribers were not notified because the live link did not change."
				: "Livestream saved. Subscribers are not notified while the stream is marked offline.";
		}
		return NextResponse.json(
			{ success: true, settings: savedSettings, notificationNotice, ...(notificationWarning ? { notificationWarning } : {}) },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not save the livestream settings.";
		return NextResponse.json({ success: false, error: message }, { status: 502 });
	}
}
