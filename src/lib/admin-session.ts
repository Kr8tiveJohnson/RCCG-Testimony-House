import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "rccg_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

function getAdminPassword() {
	return process.env.LIVESTREAM_ADMIN_PASSWORD;
}

function sign(payload: string, password: string) {
	return createHmac("sha256", password).update(payload).digest("base64url");
}

export function adminPasswordConfigured() {
	return (getAdminPassword()?.length ?? 0) >= 16;
}

export function isSameOriginRequest(request: Request) {
	const origin = request.headers.get("origin");
	if (!origin) return false;
	try {
		return new URL(origin).origin === new URL(request.url).origin;
	} catch {
		return false;
	}
}

export function verifyAdminPassword(candidate: unknown) {
	const password = getAdminPassword();
	if (!password || typeof candidate !== "string") return false;
	const expected = createHash("sha256").update(password).digest();
	const actual = createHash("sha256").update(candidate).digest();
	return timingSafeEqual(expected, actual);
}

export function createAdminSessionToken() {
	const password = getAdminPassword();
	if (!password) throw new Error("LIVESTREAM_ADMIN_PASSWORD is not configured.");
	const expiresAt = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS);
	return `${expiresAt}.${sign(expiresAt, password)}`;
}

export function isValidAdminSessionToken(token: string | undefined) {
	const password = getAdminPassword();
	if (!password || !token) return false;
	const [expiresAt, signature, extra] = token.split(".");
	if (!expiresAt || !signature || extra || !/^\d+$/.test(expiresAt)) return false;
	if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

	const expected = Buffer.from(sign(expiresAt, password));
	const actual = Buffer.from(signature);
	return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function hasAdminSession() {
	const cookieStore = await cookies();
	return isValidAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
