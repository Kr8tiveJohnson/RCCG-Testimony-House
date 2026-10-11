import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isSameOriginRequest, isValidAdminSessionToken } from "../../../../lib/admin-session";
import { getPostgresPool } from "../../../../lib/postgres";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function getImageMimeType(bytes: Buffer) {
	if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
	if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
	if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
	if (bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))) return "image/gif";
	return null;
}

export async function POST(request: Request) {
	if (!isSameOriginRequest(request)) {
		return NextResponse.json({ success: false, error: "Image upload request was rejected." }, { status: 403 });
	}
	if (!isValidAdminSessionToken(request.headers.get("cookie")?.match(/(?:^|;\s*)rccg_admin_session=([^;]+)/)?.[1])) {
		return NextResponse.json({ success: false, error: "Sign in to upload images." }, { status: 401 });
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return NextResponse.json({ success: false, error: "Choose a valid image file and try again." }, { status: 400 });
	}
	const file = formData.get("image");
	if (!(file instanceof File)) {
		return NextResponse.json({ success: false, error: "Choose an image file to upload." }, { status: 400 });
	}
	if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
		return NextResponse.json({ success: false, error: "Choose an image smaller than 5 MB." }, { status: 400 });
	}

	const imageData = Buffer.from(await file.arrayBuffer());
	const mimeType = getImageMimeType(imageData);
	if (!mimeType) {
		return NextResponse.json({ success: false, error: "Use a valid JPEG, PNG, WebP, or GIF image." }, { status: 400 });
	}

	try {
		const id = randomUUID();
		await getPostgresPool().query(
			"INSERT INTO website_media (id, mime_type, image_data) VALUES ($1, $2, $3)",
			[id, mimeType, imageData],
		);
		return NextResponse.json({ success: true, image: `/api/media/${id}` }, { headers: { "Cache-Control": "no-store" } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not save the image.";
		return NextResponse.json({ success: false, error: message }, { status: 503 });
	}
}
