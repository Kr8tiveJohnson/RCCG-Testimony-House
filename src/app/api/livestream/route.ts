import { NextResponse } from "next/server";
import { getLivestreamSettings } from "../../../lib/livestream-store";

export const runtime = "nodejs";

export async function GET() {
	try {
		const settings = await getLivestreamSettings();
		return NextResponse.json({ success: true, settings }, { headers: { "Cache-Control": "no-store" } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not load the current livestream.";
		return NextResponse.json({ success: false, error: message }, {
			status: 502,
			headers: { "Cache-Control": "no-store" },
		});
	}
}
