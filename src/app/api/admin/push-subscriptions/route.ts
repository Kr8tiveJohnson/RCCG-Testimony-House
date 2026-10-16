import { NextResponse } from "next/server";
import { isValidAdminSessionToken } from "../../../../lib/admin-session";
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

function isAuthorized(request: Request) {
	return isValidAdminSessionToken(request.headers.get("cookie")?.match(/(?:^|;\s*)rccg_admin_session=([^;]+)/)?.[1]);
}

export async function GET(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ success: false, error: "Sign in to view notification subscribers." }, { status: 401 });
	}

	if (!isPostgresConfigured()) {
		return NextResponse.json({ success: true, subscriptions: [] }, { headers: { "Cache-Control": "no-store" } });
	}

	try {
		const pool = getPostgresPool();
		await pool.query(CREATE_TABLE_QUERY);
		const result = await pool.query<{ id: string; created_at: Date; updated_at: Date }>(
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
