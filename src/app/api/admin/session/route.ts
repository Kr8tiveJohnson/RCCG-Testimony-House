import { NextResponse } from "next/server";
import {
	ADMIN_SESSION_COOKIE,
	ADMIN_SESSION_TTL_SECONDS,
	adminPasswordConfigured,
	createAdminSessionToken,
	isSameOriginRequest,
	verifyAdminPassword,
} from "../../../../lib/admin-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Sign-in request was rejected." }, { status: 403 });
	}
	if (!adminPasswordConfigured()) {
		return NextResponse.json({ success: false, error: "Set LIVESTREAM_ADMIN_PASSWORD to a private password of at least 16 characters." }, { status: 503 });
	}

	let password: unknown;
	try {
		const body = await request.json() as { password?: unknown };
		password = body.password;
	} catch {
		return NextResponse.json({ success: false, error: "Enter the admin password and try again." }, { status: 400 });
	}

	if (!verifyAdminPassword(password)) {
		return NextResponse.json({ success: false, error: "The password is incorrect." }, { status: 401 });
	}

	const response = NextResponse.json({ success: true });
	response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: ADMIN_SESSION_TTL_SECONDS,
	});
	return response;
}

export async function DELETE(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Sign-out request was rejected." }, { status: 403 });
	}
	const response = NextResponse.json({ success: true });
	response.cookies.set(ADMIN_SESSION_COOKIE, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: 0,
	});
	return response;
}
