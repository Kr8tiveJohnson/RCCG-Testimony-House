import { NextResponse } from "next/server";
import { getPushPublicKey } from "../../../../lib/web-push";

export const runtime = "nodejs";

export async function GET() {
	const publicKey = getPushPublicKey();
	if (!publicKey) {
		return NextResponse.json({ success: false, error: "Push notifications are not configured." }, { status: 503 });
	}
	return NextResponse.json({ success: true, publicKey }, { headers: { "Cache-Control": "no-store" } });
}
