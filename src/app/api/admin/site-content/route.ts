import { NextResponse } from "next/server";
import { isSameOriginRequest, isValidAdminSessionToken } from "../../../../lib/admin-session";
import { getWebsiteContent, saveWebsiteContent } from "../../../../lib/website-content";
import { isWebsiteContent } from "../../../../lib/website-content-model";
import { notifyNewEvents, notifyNewSermons } from "../../../../lib/web-push";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
	return isValidAdminSessionToken(request.headers.get("cookie")?.match(/(?:^|;\s*)rccg_admin_session=([^;]+)/)?.[1]);
}

export async function GET(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Sign in to manage website content." }, { status: 401 });
	}

	try {
		const content = await getWebsiteContent();
		return NextResponse.json({ success: true, content }, { headers: { "Cache-Control": "no-store" } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not load website content.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}

export async function POST(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Website content update request was rejected." }, { status: 403 });
	}
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Sign in to manage website content." }, { status: 401 });
	}

	let content: unknown;
	try {
		content = await request.json();
	} catch {
		return NextResponse.json({ success: false, error: "Enter valid website content." }, { status: 400 });
	}
	if (!isWebsiteContent(content)) {
		return NextResponse.json({ success: false, error: "Check the website content fields and try again." }, { status: 400 });
	}

	try {
		const previousContent = await getWebsiteContent();
		const savedContent = await saveWebsiteContent(content);
		let notificationWarning: string | undefined;
		try {
			const sermonNotifications = await notifyNewSermons(previousContent.sermons, savedContent.sermons);
			const eventNotifications = await notifyNewEvents(previousContent.events, savedContent.events);
			notificationWarning = sermonNotifications.warning || eventNotifications.warning;
		} catch (error) {
			notificationWarning = error instanceof Error ? error.message : "Content was published, but notifications could not be sent.";
			console.error("Content was published but push notifications failed.", error);
		}
		return NextResponse.json(
			{ success: true, content: savedContent, ...(notificationWarning ? { notificationWarning } : {}) },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not save website content.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}
