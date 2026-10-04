import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
	if (!scriptUrl) {
		return NextResponse.json({ success: false, error: "Google Sheet integration is not configured." }, { status: 503 });
	}

	try {
		const upstreamUrl = new URL(scriptUrl);
		const requestUrl = new URL(request.url);
		for (const key of ["status", "from", "to"]) {
			const value = requestUrl.searchParams.get(key);
			if (value) upstreamUrl.searchParams.set(key, value);
		}

		const response = await fetch(upstreamUrl, { cache: "no-store" });
		const body = await response.text();
		let result: { success?: boolean; entries?: unknown[]; error?: string };
		try {
			result = JSON.parse(body);
		} catch {
			return NextResponse.json({
				success: false,
				error: "The deployed Google Apps Script is outdated or missing doGet. Deploy a new web app version with the latest google-apps-script-membership.gs.",
			}, { status: 502 });
		}

		if (!response.ok) {
			return NextResponse.json({ success: false, error: result.error || "Google Apps Script returned an error." }, { status: 502 });
		}

		return NextResponse.json(result, { status: result.success === false ? 502 : 200 });
	} catch (error) {
		const detail = error instanceof Error ? error.message : "Unknown upstream error";
		return NextResponse.json({ success: false, error: `Could not reach the Google Apps Script deployment: ${detail}` }, { status: 502 });
	}
}