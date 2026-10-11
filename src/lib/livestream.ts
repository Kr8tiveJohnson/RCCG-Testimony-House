export type LivestreamPlatform = "youtube" | "facebook";

export type LivestreamSettings = {
	platform: LivestreamPlatform;
	url: string;
	isLive: boolean;
};

export const DEFAULT_LIVESTREAM_SETTINGS: LivestreamSettings = {
	platform: "youtube",
	url: "https://www.youtube.com/live/WwGdulhLa1w",
	isLive: false,
};

export function getYouTubeVideoId(value: string) {
	try {
		const url = new URL(value);
		const host = url.hostname.toLowerCase();
		if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
		if (host === "youtu.be") {
			const id = url.pathname.split("/").filter(Boolean)[0];
			return id && /^[\w-]{11}$/.test(id) ? id : null;
		}
		if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) return null;
		const id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:live|embed|shorts)\/([\w-]{11})(?:\/|$)/)?.[1];
		return id && /^[\w-]{11}$/.test(id) ? id : null;
	} catch {
		return null;
	}
}

function isFacebookVideoUrl(value: string) {
	try {
		const url = new URL(value);
		const host = url.hostname.toLowerCase();
		if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
		if (host === "fb.watch") return Boolean(url.pathname.split("/").filter(Boolean)[0]);
		if (!(host === "facebook.com" || host.endsWith(".facebook.com"))) return false;
		const path = url.pathname.toLowerCase();
		return path.includes("/videos/") || path.startsWith("/watch") || path.startsWith("/share/v/") || url.searchParams.has("v");
	} catch {
		return false;
	}
}

export function isLivestreamSettings(value: unknown): value is LivestreamSettings {
	if (!value || typeof value !== "object") return false;
	const settings = value as Record<string, unknown>;
	if (typeof settings.url !== "string" || settings.url.length > 2048 || typeof settings.isLive !== "boolean") return false;
	if (settings.platform === "youtube") return getYouTubeVideoId(settings.url) !== null;
	if (settings.platform === "facebook") return isFacebookVideoUrl(settings.url);
	return false;
}

export function getLivestreamEmbedUrl(settings: LivestreamSettings) {
	if (settings.platform === "youtube") {
		const videoId = getYouTubeVideoId(settings.url);
		if (!videoId) throw new Error("The YouTube livestream URL is invalid.");
		return `https://www.youtube.com/embed/${videoId}`;
	}

	if (!isFacebookVideoUrl(settings.url)) throw new Error("The Facebook livestream URL is invalid.");
	const embedUrl = new URL("https://www.facebook.com/plugins/video.php");
	embedUrl.searchParams.set("href", settings.url);
	embedUrl.searchParams.set("show_text", "false");
	return embedUrl.toString();
}

export function getLivestreamPlatformLabel(platform: LivestreamPlatform) {
	return platform === "youtube" ? "YouTube" : "Facebook";
}
