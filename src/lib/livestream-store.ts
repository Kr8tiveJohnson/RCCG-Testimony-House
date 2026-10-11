import { getPostgresPool } from "./postgres";
import {
	DEFAULT_LIVESTREAM_SETTINGS,
	isLivestreamSettings,
	type LivestreamSettings,
} from "./livestream";

export async function getLivestreamSettings() {
	const result = await getPostgresPool().query<{ platform: string; url: string; is_live: boolean }>(
		"SELECT platform, url, is_live FROM livestream_settings WHERE singleton = TRUE",
	);
	const settings = result.rows[0];
	if (!settings) return DEFAULT_LIVESTREAM_SETTINGS;
	const mappedSettings = { platform: settings.platform, url: settings.url, isLive: settings.is_live };
	if (!isLivestreamSettings(mappedSettings)) {
		throw new Error("The saved livestream settings are invalid. Update them from the admin page.");
	}
	return mappedSettings;
}

export async function saveLivestreamSettings(settings: LivestreamSettings) {
	const result = await getPostgresPool().query<{ platform: string; url: string; is_live: boolean }>(
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
