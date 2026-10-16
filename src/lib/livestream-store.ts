import { getPostgresPool, isPostgresConfigured } from "./postgres";
import {
	DEFAULT_LIVESTREAM_SETTINGS,
	isLivestreamSettings,
	type LivestreamSettings,
} from "./livestream";

const CREATE_TABLE_QUERY = `
	CREATE TABLE IF NOT EXISTS livestream_settings (
		singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton = TRUE),
		platform TEXT NOT NULL CHECK (platform IN ('youtube', 'facebook')),
		url TEXT NOT NULL CHECK (char_length(url) <= 2048),
		is_live BOOLEAN NOT NULL DEFAULT FALSE,
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);
	ALTER TABLE livestream_settings ADD COLUMN IF NOT EXISTS is_live BOOLEAN NOT NULL DEFAULT FALSE;
`;

export async function getLivestreamSettings(): Promise<LivestreamSettings> {
	if (!isPostgresConfigured()) {
		return DEFAULT_LIVESTREAM_SETTINGS;
	}

	try {
		const pool = getPostgresPool();
		await pool.query(CREATE_TABLE_QUERY);
		const result = await pool.query<{ platform: string; url: string; is_live: boolean }>(
			"SELECT platform, url, is_live FROM livestream_settings WHERE singleton = TRUE",
		);
		const settings = result.rows[0];
		if (!settings) return DEFAULT_LIVESTREAM_SETTINGS;
		const mappedSettings = { platform: settings.platform, url: settings.url, isLive: settings.is_live };
		if (isLivestreamSettings(mappedSettings)) {
			return mappedSettings;
		}
	} catch (error) {
		console.warn("Could not retrieve livestream settings from PostgreSQL, falling back to defaults.", error);
	}

	return DEFAULT_LIVESTREAM_SETTINGS;
}

export async function saveLivestreamSettings(settings: LivestreamSettings): Promise<LivestreamSettings> {
	const pool = getPostgresPool();
	await pool.query(CREATE_TABLE_QUERY);
	const result = await pool.query<{ platform: string; url: string; is_live: boolean }>(
		`INSERT INTO livestream_settings (singleton, platform, url, is_live)
		 VALUES (TRUE, $1, $2, $3)
		 ON CONFLICT (singleton) DO UPDATE
		 SET platform = EXCLUDED.platform, url = EXCLUDED.url, is_live = EXCLUDED.is_live, updated_at = NOW()
		 RETURNING platform, url, is_live`,
		[settings.platform, settings.url, settings.isLive],
	);
	const savedSettings = result.rows[0];
	const mappedSettings = savedSettings && {
		platform: savedSettings.platform,
		url: savedSettings.url,
		isLive: savedSettings.is_live,
	};
	if (!mappedSettings || !isLivestreamSettings(mappedSettings)) {
		throw new Error("The database did not confirm the saved livestream settings.");
	}
	return mappedSettings;
}
