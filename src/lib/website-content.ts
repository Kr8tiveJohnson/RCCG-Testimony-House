import "server-only";
import { getPostgresPool, isPostgresConfigured } from "./postgres";
import { DEFAULT_WEBSITE_CONTENT, isWebsiteContent, type WebsiteContent } from "./website-content-model";

export { getMinistryIcon } from "./website-content-model";
export type { EventContent, MinistryContent, SermonContent, WebsiteContent } from "./website-content-model";

const CREATE_TABLE_QUERY = `
	CREATE TABLE IF NOT EXISTS website_content (
		singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton = TRUE),
		content JSONB NOT NULL CHECK (jsonb_typeof(content) = 'object'),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);
`;

export async function getWebsiteContent(): Promise<WebsiteContent> {
	if (!isPostgresConfigured()) {
		return DEFAULT_WEBSITE_CONTENT;
	}

	try {
		const pool = getPostgresPool();
		await pool.query(CREATE_TABLE_QUERY);
		await pool.query(
			"INSERT INTO website_content (singleton, content) VALUES (TRUE, $1::jsonb) ON CONFLICT (singleton) DO NOTHING",
			[JSON.stringify(DEFAULT_WEBSITE_CONTENT)],
		);
		const result = await pool.query<{ content: unknown }>(
			"SELECT content FROM website_content WHERE singleton = TRUE",
		);
		const content = result.rows[0]?.content;
		if (isWebsiteContent(content)) {
			return content;
		}
	} catch (error) {
		console.warn("Could not retrieve website content from PostgreSQL, falling back to defaults.", error);
	}

	return DEFAULT_WEBSITE_CONTENT;
}

export async function saveWebsiteContent(content: WebsiteContent): Promise<WebsiteContent> {
	const pool = getPostgresPool();
	await pool.query(CREATE_TABLE_QUERY);
	const result = await pool.query<{ content: unknown }>(
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
