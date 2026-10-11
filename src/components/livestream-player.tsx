"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { LivestreamStatus } from "./livestream-status";
import {
	DEFAULT_LIVESTREAM_SETTINGS,
	getLivestreamEmbedUrl,
	getLivestreamPlatformLabel,
	isLivestreamSettings,
	type LivestreamSettings,
} from "../lib/livestream";

export function LivestreamPlayer() {
	const [settings, setSettings] = useState<LivestreamSettings>(DEFAULT_LIVESTREAM_SETTINGS);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;

		async function loadSettings() {
			try {
				const response = await fetch("/api/livestream", { cache: "no-store" });
				const result = await response.json() as { success?: boolean; settings?: LivestreamSettings; error?: string };
				if (!response.ok || !result.success || !isLivestreamSettings(result.settings)) {
					throw new Error(result.error || "The current livestream link could not be loaded.");
				}
				if (active) {
					setSettings(result.settings);
					setError("");
				}
			} catch {
				if (active) setError("We could not refresh the latest stream details. Showing the fallback livestream link.");
			} finally {
				if (active) setLoading(false);
			}
		}

		void loadSettings();
		return () => {
			active = false;
		};
	}, []);

	const embedUrl = getLivestreamEmbedUrl(settings);
	const platformLabel = getLivestreamPlatformLabel(settings.platform);

	return (
		<>
			<div className="livestream-player">
				<div className="livestream-player__screen">
					<iframe
						className="livestream-player__embed"
						src={embedUrl}
						title={`RCCG Testimony House ${platformLabel} livestream`}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					/>
					{settings.platform === "youtube" ? <LivestreamStatus /> : (
						<div className={`livestream-player__status${settings.isLive ? " livestream-player__status--live" : ""}`}><span aria-hidden="true" /> {settings.isLive ? "FACEBOOK LIVE NOW" : "FACEBOOK STREAM"}</div>
					)}
				</div>
				<div className="livestream-player__footer">
					<span>{loading ? "LOADING STREAM" : `${platformLabel.toUpperCase()} LIVE STREAM`}</span>
					<span>Streaming from RCCG Testimony House</span>
				</div>
			</div>
			{error ? <p className="livestream-player__error" role="status">{error}</p> : null}
			<div className="livestream-page__actions">
				<a className="pill-button pill-button--purple" href={settings.url} target="_blank" rel="noreferrer">
					Watch on {platformLabel} <span><ArrowUpRight size={17} /></span>
				</a>
			</div>
		</>
	);
}
