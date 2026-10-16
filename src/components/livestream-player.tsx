"use client";

import Image from "next/image";
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
	const [logoPhase, setLogoPhase] = useState<"in" | "hold" | "out" | "hidden">("hidden");

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

	// Logo animation: bounce in -> hold -> slide out left -> hidden -> repeat every 30s
	useEffect(() => {
		const timeouts: ReturnType<typeof setTimeout>[] = [];

		function runCycle() {
			setLogoPhase("in");
			timeouts.push(setTimeout(() => setLogoPhase("hold"), 700));    // bounce done
			timeouts.push(setTimeout(() => setLogoPhase("out"), 4500));    // hold ~3.8s then exit
			timeouts.push(setTimeout(() => setLogoPhase("hidden"), 5500)); // slide-out lasts 1s
		}

		timeouts.push(setTimeout(runCycle, 1500)); // first cycle after 1.5s
		const interval = setInterval(runCycle, 30000);

		return () => {
			timeouts.forEach(clearTimeout);
			clearInterval(interval);
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
						allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
						allowFullScreen
					/>
					{settings.platform === "youtube" ? <LivestreamStatus /> : (
						<div className={`livestream-player__status${settings.isLive ? " livestream-player__status--live" : ""}`}>
							<span aria-hidden="true" /> {settings.isLive ? "FACEBOOK LIVE NOW" : "FACEBOOK STREAM"}
						</div>
					)}
				</div>
				<div className="livestream-player__footer">
					<span>{loading ? "LOADING STREAM" : `${platformLabel.toUpperCase()} LIVE STREAM`}</span>
					<span className="livestream-player__footer-brand">
						{logoPhase !== "hidden" && (
							<span className={`livestream-player__logo-wrap livestream-player__logo-wrap--${logoPhase}`}>
								<Image
									src="/images/logo/TESTIMONY LOGO.png"
									alt="RCCG Testimony House"
									width={28}
									height={28}
									className="livestream-player__logo"
									priority
								/>
							</span>
						)}
						Streaming from RCCG Testimony House
					</span>
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
