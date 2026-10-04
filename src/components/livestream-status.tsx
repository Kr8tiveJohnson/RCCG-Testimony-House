"use client";

import { useEffect, useState } from "react";

type StreamStatus = "checking" | "live" | "upcoming" | "replay" | "ended" | "unknown";

const statusLabels: Record<StreamStatus, string> = {
	checking: "CHECKING STREAM",
	live: "LIVE NOW",
	upcoming: "LIVE SOON",
	replay: "REPLAY AVAILABLE",
	ended: "STREAM ENDED",
	unknown: "LIVE STREAM",
};

export function LivestreamStatus() {
	const [status, setStatus] = useState<StreamStatus>("checking");

	useEffect(() => {
		let active = true;

		async function refreshStatus() {
			try {
				const response = await fetch("/api/livestream-status", { cache: "no-store" });
				const result = await response.json() as { success?: boolean; status?: StreamStatus };
				if (!response.ok || !result.success || !result.status) throw new Error("Stream status is unavailable.");
				if (active) setStatus(result.status);
			} catch {
				if (active) setStatus("unknown");
			}
		}

		void refreshStatus();
		const intervalId = window.setInterval(() => void refreshStatus(), 60_000);

		return () => {
			active = false;
			window.clearInterval(intervalId);
		};
	}, []);

	return (
		<div className={`livestream-player__status livestream-player__status--${status}`} aria-live="polite">
			<span aria-hidden="true" /> {statusLabels[status]}
		</div>
	);
}