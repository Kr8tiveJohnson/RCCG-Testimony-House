import { NextResponse } from "next/server";

export const revalidate = 60;

const videoId = "WwGdulhLa1w";

type YouTubeVideo = {
	snippet?: { liveBroadcastContent?: string };
	liveStreamingDetails?: { actualEndTime?: string };
};

type YouTubeResponse = {
	items?: YouTubeVideo[];
};

export async function GET() {
	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) {
		return NextResponse.json({ success: false, status: "unknown" }, { status: 503 });
	}

	try {
		const url = new URL("https://www.googleapis.com/youtube/v3/videos");
		url.searchParams.set("part", "snippet,liveStreamingDetails");
		url.searchParams.set("id", videoId);
		url.searchParams.set("key", apiKey);

		const response = await fetch(url, { next: { revalidate: 60 } });
		if (!response.ok) throw new Error("YouTube API request failed.");

		const data = await response.json() as YouTubeResponse;
		const video = data.items?.[0];
		if (!video) return NextResponse.json({ success: true, status: "unknown" });

		const broadcastStatus = video.snippet?.liveBroadcastContent;
		const status = broadcastStatus === "live"
			? "live"
			: broadcastStatus === "upcoming"
				? "upcoming"
				: video.liveStreamingDetails?.actualEndTime
					? "replay"
					: "ended";

		return NextResponse.json({ success: true, status });
	} catch {
		return NextResponse.json({ success: false, status: "unknown" }, { status: 502 });
	}
}