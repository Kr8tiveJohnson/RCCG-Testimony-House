import { NextResponse } from "next/server";
import { getWebsiteContent } from "../../../lib/website-content";

export const runtime = "nodejs";

export async function GET() {
	try {
		const content = await getWebsiteContent();
		return NextResponse.json({ success: true, content }, {
			headers: { "Cache-Control": "no-store" },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not load website content.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}
