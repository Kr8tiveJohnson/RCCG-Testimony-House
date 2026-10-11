import { NextResponse } from "next/server";
import { isValidAdminSessionToken } from "../../../../lib/admin-session";
import { getPostgresPool } from "../../../../lib/postgres";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
	return isValidAdminSessionToken(request.headers.get("cookie")?.match(/(?:^|;\s*)rccg_admin_session=([^;]+)/)?.[1]);
}

export async function GET(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Sign in to view notification subscribers." }, { status: 401 });
	}

	try {
		const result = await getPostgresPool().query<{ id: string; created_at: Date; updated_at: Date }>(
			"SELECT id, created_at, updated_at FROM push_subscriptions ORDER BY created_at DESC",
		);
		return NextResponse.json({
			success: true,
			subscriptions: result.rows.map((row) => ({
				id: row.id,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			})),
		}, { headers: { "Cache-Control": "no-store" } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not load notification subscribers.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}
