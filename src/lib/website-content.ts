import "server-only";
import { getPostgresPool } from "./postgres";
import { DEFAULT_WEBSITE_CONTENT, isWebsiteContent, type WebsiteContent } from "./website-content-model";

export { getMinistryIcon } from "./website-content-model";
export type { EventContent, MinistryContent, SermonContent, WebsiteContent } from "./website-content-model";

export async function getWebsiteContent(): Promise<WebsiteContent> {
	const pool = getPostgresPool();
	await pool.query(
		"INSERT INTO website_content (singleton, content) VALUES (TRUE, $1::jsonb) ON CONFLICT (singleton) DO NOTHING",
		[JSON.stringify(DEFAULT_WEBSITE_CONTENT)],
	);
	const result = await pool.query<{ content: unknown }>(
		"SELECT content FROM website_content WHERE singleton = TRUE",
	);
	const content = result.rows[0]?.content;
	if (!isWebsiteContent(content)) {
		throw new Error("Website content in PostgreSQL is invalid. Correct it through the admin page.");
	}
	return content;
}

export async function saveWebsiteContent(content: WebsiteContent): Promise<WebsiteContent> {
	const result = await getPostgresPool().query<{ content: unknown }>(
		`INSERT INTO website_content (singleton, content)
		 VALUES (TRUE, $1::jsonb)
		 ON CONFLICT (singleton) DO UPDATE
		 SET content = EXCLUDED.content, updated_at = NOW()
		 RETURNING content`,
		[JSON.stringify(content)],
	);
	const savedContent = result.rows[0]?.content;
	if (!isWebsiteContent(savedContent)) {
		throw new Error("The database did not confirm the saved website content.");
	}
	return savedContent;
}
