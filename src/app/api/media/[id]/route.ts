import { NextResponse } from "next/server";
import { getPostgresPool } from "../../../../lib/postgres";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
		return new NextResponse(null, { status: 404 });
	}

	try {
		const result = await getPostgresPool().query<{ mime_type: string; image_data: Buffer }>(
			"SELECT mime_type, image_data FROM website_media WHERE id = $1",
			[id],
		);
		const image = result.rows[0];
		if (!image) return new NextResponse(null, { status: 404 });
		return new NextResponse(new Uint8Array(image.image_data), {
			headers: {
				"Cache-Control": "public, max-age=31536000, immutable",
				"Content-Length": String(image.image_data.length),
				"Content-Security-Policy": "default-src 'none'; sandbox",
				"Content-Type": image.mime_type,
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch {
		return NextResponse.json({ success: false, error: "Could not load the image." }, { status: 503 });
	}
}
