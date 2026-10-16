"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
	BookOpen,
	Bell,
	CalendarDays,
	Church,
	Clock3,
	FileText,
	ImagePlus,
	LogOut,
	Radio,
	Save,
	Send,
	UsersRound,
} from "lucide-react";
import {
	DEFAULT_LIVESTREAM_SETTINGS,
	type LivestreamSettings,
} from "../lib/livestream";
import {
	DEFAULT_WEBSITE_CONTENT,
	type SermonContent,
	type WebsiteContent,
} from "../lib/website-content-model";

const sections = [
	{ id: "overview", label: "Overview", icon: Church },
	{ id: "livestream", label: "Livestream", icon: Radio },
	{ id: "pages", label: "Page content", icon: FileText },
	{ id: "services", label: "Sunday services", icon: Clock3 },
	{ id: "sermons", label: "Sermons", icon: BookOpen },
	{ id: "events", label: "Event", icon: CalendarDays },
	{ id: "notifications", label: "Notifications", icon: Bell },
	{ id: "memberships", label: "Memberships", icon: UsersRound },
] as const;

type SectionId = (typeof sections)[number]["id"];

type MembershipEntry = {
	"Submitted At"?: string | Date;
	Status?: string;
	"First Name"?: string;
	"Surname"?: string;
	"Email Address"?: string;
	"Telephone / WhatsApp"?: string;
	"Residential Address"?: string;
	Category?: string;
};

type PushSubscriptionEntry = {
	id: string;
	createdAt: string;
	updatedAt: string;
};

export function AdminDashboard() {
	const [activeSection, setActiveSection] = useState<SectionId>("overview");
	const [content, setContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);
	const [notice, setNotice] = useState("");
	const [contentLoading, setContentLoading] = useState(true);
	const [contentSaving, setContentSaving] = useState(false);
	const [contentError, setContentError] = useState("");
	const [uploadingImage, setUploadingImage] = useState("");
	const [membershipRows, setMembershipRows] = useState<MembershipEntry[]>([]);
	const [membershipStatus, setMembershipStatus] = useState("All");
	const [membershipFrom, setMembershipFrom] = useState("");
	const [membershipTo, setMembershipTo] = useState("");
	const [membershipLoading, setMembershipLoading] = useState(false);
	const [membershipError, setMembershipError] = useState("");
	const [livestreamSettings, setLivestreamSettings] = useState<LivestreamSettings>(DEFAULT_LIVESTREAM_SETTINGS);
	const [livestreamLoading, setLivestreamLoading] = useState(false);
	const [livestreamSaving, setLivestreamSaving] = useState(false);
	const [livestreamError, setLivestreamError] = useState("");
	const [livestreamNotice, setLivestreamNotice] = useState("");
	const [pushSubscriptions, setPushSubscriptions] = useState<PushSubscriptionEntry[]>([]);
	const [pushSubscriptionsLoading, setPushSubscriptionsLoading] = useState(false);
	const [pushSubscriptionsError, setPushSubscriptionsError] = useState("");
	const [broadcastTitle, setBroadcastTitle] = useState("");
	const [broadcastBody, setBroadcastBody] = useState("");
	const [broadcastUrl, setBroadcastUrl] = useState("/events");
	const [broadcastSending, setBroadcastSending] = useState(false);
	const [broadcastNotice, setBroadcastNotice] = useState("");
	const [broadcastError, setBroadcastError] = useState("");

	useEffect(() => {
		let active = true;
		async function loadContent() {
			setContentLoading(true);
			setContentError("");
			try {
				const response = await fetch("/api/admin/site-content", { cache: "no-store" });
				const result = await response.json() as { success?: boolean; content?: WebsiteContent; error?: string; notificationWarning?: string };
				if (!response.ok || !result.success || !result.content) {
					throw new Error(result.error || "Could not load saved website content.");
				}
				if (active) setContent(result.content);
			} catch (error) {
				if (active) setContentError(error instanceof Error ? error.message : "Could not load saved website content.");
			} finally {
				if (active) setContentLoading(false);
			}
		}
		void loadContent();
		return () => { active = false; };
	}, []);

	const loadMembershipRows = useCallback(async () => {
		setMembershipLoading(true);
		setMembershipError("");

		const params = new URLSearchParams();
		if (membershipStatus && membershipStatus !== "All") params.set("status", membershipStatus);
		if (membershipFrom) params.set("from", membershipFrom);
		if (membershipTo) params.set("to", membershipTo);

		try {
			const response = await fetch(`/api/memberships?${params.toString()}`);
			const result = await response.json() as { success?: boolean; entries?: MembershipEntry[]; error?: string };
			if (!response.ok || result.success === false) throw new Error(result.error || "Unable to load membership data.");

			setMembershipRows(Array.isArray(result.entries) ? result.entries : []);
		} catch (error) {
			setMembershipRows([]);
			setMembershipError(error instanceof Error ? error.message : "Could not load membership entries from the Google Sheet right now.");
		} finally {
			setMembershipLoading(false);
		}
	}, [membershipFrom, membershipStatus, membershipTo]);

	useEffect(() => {
		if (activeSection !== "memberships") return;
		const timeoutId = window.setTimeout(() => {
			void loadMembershipRows();
		}, 0);

		return () => window.clearTimeout(timeoutId);
	}, [activeSection, loadMembershipRows]);

	const loadPushSubscriptions = useCallback(async () => {
		setPushSubscriptionsLoading(true);
		setPushSubscriptionsError("");
		try {
			const response = await fetch("/api/admin/push-subscriptions", { cache: "no-store" });
			const result = await response.json() as { success?: boolean; subscriptions?: PushSubscriptionEntry[]; error?: string };
			if (!response.ok || !result.success || !Array.isArray(result.subscriptions)) {
				throw new Error(result.error || "Could not load notification subscribers.");
			}
			setPushSubscriptions(result.subscriptions);
		} catch (error) {
			setPushSubscriptionsError(error instanceof Error ? error.message : "Could not load notification subscribers.");
		} finally {
			setPushSubscriptionsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (activeSection !== "notifications") return;
		const timeoutId = window.setTimeout(() => void loadPushSubscriptions(), 0);
		return () => window.clearTimeout(timeoutId);
	}, [activeSection, loadPushSubscriptions]);

	useEffect(() => {
		if (activeSection !== "livestream") return;
		let active = true;

		async function loadLivestreamSettings() {
			setLivestreamLoading(true);
			setLivestreamError("");
			try {
				const response = await fetch("/api/admin/livestream", { cache: "no-store" });
				const result = await response.json() as { success?: boolean; settings?: LivestreamSettings; error?: string; notificationNotice?: string };
				if (!response.ok || !result.success || !result.settings) {
					throw new Error(result.error || "Could not load the current livestream settings.");
				}
				if (active) setLivestreamSettings(result.settings);
			} catch (error) {
				if (active) setLivestreamError(error instanceof Error ? error.message : "Could not load the current livestream settings.");
			} finally {
				if (active) setLivestreamLoading(false);
			}
		}

		void loadLivestreamSettings();
		return () => {
			active = false;
		};
	}, [activeSection]);

	function updatePageContent(name: keyof WebsiteContent["pages"], value: string) {
		setContent((current) => ({ ...current, pages: { ...current.pages, [name]: value } }));
		setNotice("");
	}

	function updateServiceSchedule(index: number, field: "label" | "time", value: string) {
		setContent((current) => ({
			...current,
			services: {
				...current.services,
				schedule: current.services.schedule.map((item, itemIndex) =>
					itemIndex === index ? { ...item, [field]: value } : item),
			},
		}));
		setNotice("");
	}

	function setupWelcomeTemplate(variant: "standard" | "warm") {
		if (variant === "standard") {
			setBroadcastTitle("Welcome to RCCG Testimony House! 🙏");
			setBroadcastBody("We are blessed to have you in our church family! Stay connected for weekly services, inspiring sermon notes, and special event announcements.");
			setBroadcastUrl("/");
		} else {
			setBroadcastTitle("Glad You Are Connected! ✨");
			setBroadcastBody("Thank you for subscribing to Testimony House updates. We pray God's supernatural grace, peace, and favor rest upon you and your household.");
			setBroadcastUrl("/about");
		}
		setBroadcastNotice("");
		setBroadcastError("");
	}

	function setupWeeklyTemplate(type: "sunday" | "midweek" | "blessing" | "weekend") {
		if (type === "sunday") {
			setBroadcastTitle("Join Us This Sunday at Testimony House ⛪");
			setBroadcastBody("Come experience God's glorious presence, heartfelt praise, and life-changing Word! 1st Service: 7:50 AM · 2nd Service: 10:00 AM. We can't wait to worship with you!");
			setBroadcastUrl("/livestream");
		} else if (type === "midweek") {
			setBroadcastTitle("Midweek Faith Clinic & Digging Deep 📖");
			setBroadcastBody("Refuel your spiritual strength this week! Join us for an enriching study of God's Word and breakthrough prayers. Your testimony is loading.");
			setBroadcastUrl("/services");
		} else if (type === "blessing") {
			setBroadcastTitle("Your Week of Divine Favor & Restoration ✨");
			setBroadcastBody("May the Lord open doors of breakthrough for you and your household this week. Walk in victory, good health, and supernatural peace in Jesus' name!");
			setBroadcastUrl("/");
		} else {
			setBroadcastTitle("Weekend Reflection & Fellowship 🕊️");
			setBroadcastBody("As we prepare for the Lord's Day, take a moment to reflect on His faithfulness. We look forward to worshiping together this Sunday at Testimony House!");
			setBroadcastUrl("/events");
		}
		setBroadcastNotice("");
		setBroadcastError("");
	}

	function setupReminderTemplate(eventIndex: number, timing: "reminder" | "today" | "tomorrow" | "soon") {
		const targetEvent = content.events[eventIndex];
		if (!targetEvent) return;
		const prefixMap = {
			reminder: "Reminder: ",
			today: "Today: ",
			tomorrow: "Tomorrow: ",
			soon: "Happening Soon: ",
		};
		setBroadcastTitle(`${prefixMap[timing]}${targetEvent.title}`);
		const mainMsg =
			targetEvent.description?.split("\n\nMinisters:")[0]?.split("\n")[0]?.trim() ||
			(targetEvent.theme ? `Theme: '${targetEvent.theme}'` : "");
		const datePart = `Date: ${new Date(`${targetEvent.date}T12:00:00`).toLocaleDateString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric",
		})}`;
		const timePart = targetEvent.time ? ` · ${targetEvent.time}` : "";
		setBroadcastBody(mainMsg ? `${mainMsg}\n\n${datePart}${timePart}` : `${datePart}${timePart}`);
		setBroadcastUrl("/events");
		setBroadcastNotice("");
		setBroadcastError("");
	}

	async function sendBroadcastNotification(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!broadcastTitle.trim() || !broadcastBody.trim()) return;
		setBroadcastSending(true);
		setBroadcastNotice("");
		setBroadcastError("");
		try {
			const response = await fetch("/api/admin/notifications/broadcast", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: broadcastTitle,
					body: broadcastBody,
					url: broadcastUrl,
				}),
			});
			const result = (await response.json()) as {
				success?: boolean;
				sent?: number;
				failed?: number;
				warning?: string;
				error?: string;
			};
			if (!response.ok || !result.success) {
				throw new Error(result.error || "Could not send notification.");
			}
			setBroadcastNotice(
				result.warning
					? `Reminder sent to ${result.sent} device(s). ${result.warning}`
					: `Reminder notification sent successfully to ${result.sent} subscribed device(s)!`,
			);
		} catch (err) {
			setBroadcastError(err instanceof Error ? err.message : "Failed to send notification.");
		} finally {
			setBroadcastSending(false);
		}
	}

	function updateEvent(index: number, field: "title" | "image" | "date" | "time" | "organizer" | "theme" | "scripture" | "caseStudy" | "featuring" | "location" | "description", value: string) {
		setContent((current) => ({
			...current,
			events: current.events.map((item, itemIndex) => itemIndex === index
				? { ...item, [field]: field === "featuring" ? value.split("\n").map((line) => line.trim()).filter(Boolean) : value }
				: item),
		}));
		setNotice("");
	}

	function updateSermon(index: number, field: keyof SermonContent, value: string) {
		setContent((current) => ({
			...current,
			sermons: current.sermons.map((sermon, sermonIndex) => {
				if (sermonIndex !== index) return sermon;
				if (field === "scriptures" || field === "points" || field === "prayerPoints") {
					return { ...sermon, [field]: value.split("\n").map((line) => line.trim()).filter(Boolean) };
				}
				return { ...sermon, [field]: value };
			}),
		}));
		setNotice("");
	}

	function addEvent() {
		setContent((current) => ({
			...current,
			events: [...current.events, {
				title: "",
				date: new Date().toISOString().slice(0, 10),
				time: "",
				organizer: "",
				theme: "",
				scripture: "",
				caseStudy: "",
				featuring: [],
				location: "",
				description: "",
			}],
		}));
	}

	function addSermon() {
		setContent((current) => ({
			...current,
			sermons: [...current.sermons, {
				date: new Date().toISOString().slice(0, 10),
				title: "",
				service: "",
				speaker: "",
				topic: "",
				scriptures: [],
				summary: "",
				points: [],
				prayerPoints: [],
			}],
		}));
	}

	function removeSermon(index: number) {
		setContent((current) => ({ ...current, sermons: current.sermons.filter((_, sermonIndex) => sermonIndex !== index) }));
	}

	function removeEvent(index: number) {
		setContent((current) => ({ ...current, events: current.events.filter((_, itemIndex) => itemIndex !== index) }));
	}

	async function uploadImage(event: ChangeEvent<HTMLInputElement>, entryKey: string, onUploaded: (image: string) => void) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		setContentError("");
		setNotice("");
		setUploadingImage(entryKey);
		try {
			const formData = new FormData();
			formData.set("image", file);
			const response = await fetch("/api/admin/media", { method: "POST", body: formData });
			const result = await response.json() as { success?: boolean; image?: string; error?: string };
			if (!response.ok || !result.success || !result.image) {
				throw new Error(result.error || "Could not upload the image.");
			}
			onUploaded(result.image);
			setNotice("Image uploaded. Save and publish to display it on the website.");
		} catch (error) {
			setContentError(error instanceof Error ? error.message : "Could not upload the image.");
		} finally {
			setUploadingImage("");
			input.value = "";
		}
	}

	async function saveContent(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setContentError("");
		setNotice("");
		setContentSaving(true);
		try {
			const response = await fetch("/api/admin/site-content", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(content),
			});
			const result = await response.json() as { success?: boolean; content?: WebsiteContent; error?: string; notificationWarning?: string };
			if (!response.ok || !result.success || !result.content) {
				throw new Error(result.error || "Could not save website content.");
			}
			setContent(result.content);
			setNotice(result.notificationWarning
				? `Saved and published. ${result.notificationWarning}`
				: "Saved and published. The public website now displays these changes.");
		} catch (error) {
			setContentError(error instanceof Error ? error.message : "Could not save website content.");
		} finally {
			setContentSaving(false);
		}
	}

	async function saveLivestream(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLivestreamError("");
		setLivestreamNotice("");
		setLivestreamSaving(true);
		try {
			const response = await fetch("/api/admin/livestream", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(livestreamSettings),
			});
			const result = await response.json() as { success?: boolean; settings?: LivestreamSettings; error?: string; notificationNotice?: string };
			if (!response.ok || !result.success || !result.settings) {
				throw new Error(result.error || "Could not save the livestream settings.");
			}
			setLivestreamSettings(result.settings);
			setLivestreamNotice(result.notificationNotice || "Livestream updated. The public Watch live page now uses this link.");
		} catch (error) {
			setLivestreamError(error instanceof Error ? error.message : "Could not save the livestream settings.");
		} finally {
			setLivestreamSaving(false);
		}
	}

	async function signOut() {
		await fetch("/api/admin/session", { method: "DELETE" });
		window.location.reload();
	}

	return (
		<section className="admin-page page-width">
			<header className="admin-page__header">
				<div><p className="section-kicker">TESTIMONY HOUSE</p><h1>Website admin</h1></div>
				<div className="admin-page__header-actions"><span className="admin-prototype admin-prototype--private"><span /> PRIVATE ADMIN</span><button type="button" className="admin-button" onClick={() => void signOut()}><LogOut size={14} /> Sign out</button></div>
			</header>

			<div className="admin-layout">
				<nav className="admin-nav" aria-label="Admin sections">
					{sections.map(({ id, label, icon: Icon }) => (
						<button key={id} type="button" className={activeSection === id ? "admin-nav__item admin-nav__item--active" : "admin-nav__item"} aria-current={activeSection === id ? "page" : undefined} onClick={() => { setActiveSection(id); setNotice(""); }}>
							<Icon size={17} /> <span>{label}</span>
						</button>
					))}
				</nav>

				<div className="admin-workspace">
					{activeSection === "overview" ? (
						<div className="admin-panel">
							<div className="admin-panel__heading"><div><p className="section-kicker">OVERVIEW</p><h2>Website content</h2></div><button type="button" className="admin-button admin-button--primary" onClick={() => setActiveSection("pages")}><FileText size={15} /> Edit public pages</button></div>
							{contentLoading ? <p className="admin-notice" role="status">Loading saved website content...</p> : null}
							{contentError ? <p className="admin-notice admin-notice--error" role="alert">{contentError}</p> : null}
							<div className="admin-activity">
								<div><BookOpen size={16} /><span>Sermons</span><strong>{content.sermons.length}</strong></div>
								<div><CalendarDays size={16} /><span>Upcoming events</span><strong>{content.events.length}</strong></div>
							</div>
						</div>
					) : activeSection === "livestream" ? (
						<form className="admin-panel admin-livestream" onSubmit={saveLivestream}>
							<div className="admin-panel__heading">
								<div><p className="section-kicker">PUBLIC WATCH LIVE PAGE</p><h2>Livestream link</h2></div>
								<button className="admin-button admin-button--primary" disabled={livestreamLoading || livestreamSaving || Boolean(livestreamError)} type="submit"><Save size={15} /> {livestreamSaving ? "Saving..." : "Save livestream"}</button>
							</div>
							<p>Choose the platform for the next service and paste its public live video link. Saving publishes the stream on the website immediately.</p>
							<label htmlFor="livestream-platform">Streaming platform
								<select id="livestream-platform" value={livestreamSettings.platform} onChange={(event) => { const platform = event.currentTarget.value; if (platform === "youtube" || platform === "facebook") setLivestreamSettings((current) => ({ ...current, platform })); setLivestreamNotice(""); }}>
									<option value="youtube">YouTube</option>
									<option value="facebook">Facebook</option>
								</select>
							</label>
							<label htmlFor="livestream-url">Public {livestreamSettings.platform === "youtube" ? "YouTube" : "Facebook"} live video URL
								<input
									autoComplete="url"
									id="livestream-url"
									onChange={(event) => { const url = event.currentTarget.value; setLivestreamSettings((current) => ({ ...current, url })); setLivestreamNotice(""); }}
									placeholder={livestreamSettings.platform === "youtube" ? "https://www.youtube.com/live/..." : "https://www.facebook.com/.../videos/..."}
									required
									type="url"
									value={livestreamSettings.url}
								/>
							</label>
							<label className="admin-live-toggle">
								<input
									checked={livestreamSettings.isLive}
									type="checkbox"
									onChange={(event) => {
										const isLive = event.target.checked;
										setLivestreamSettings((current) => ({ ...current, isLive }));
										setLivestreamNotice("");
									}}
								/>
								<span><strong>We are live now</strong><small>Turn this on when the stream has started. Subscribers will be notified when you save.</small></span>
							</label>
							<p className="admin-livestream__help">Use the specific public livestream/video URL, not the channel or Facebook Page URL. For Facebook, the video must be public and allow embedding. Update and save this link each time the live video URL changes.</p>
							{livestreamLoading ? <p className="admin-notice" role="status">Loading saved livestream settings...</p> : null}
							{livestreamError ? <p className="admin-notice admin-notice--error" role="alert">{livestreamError}</p> : null}
							{livestreamNotice ? <p className="admin-notice" role="status">{livestreamNotice}</p> : null}
						</form>
					) : activeSection === "notifications" ? (
						<div className="admin-notifications-stack">
							<form className="admin-panel admin-broadcast-panel" onSubmit={sendBroadcastNotification}>
								<div className="admin-panel__heading">
									<div>
										<p className="section-kicker">PUSH BROADCAST CENTER</p>
										<h2>Broadcast notifications to subscribers</h2>
									</div>
									<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
										{(broadcastTitle || broadcastBody) ? (
											<button
												type="button"
												className="admin-button admin-button--sm"
												onClick={() => {
													setBroadcastTitle("");
													setBroadcastBody("");
													setBroadcastUrl("/");
													setBroadcastNotice("");
													setBroadcastError("");
												}}
											>
												Clear form
											</button>
										) : null}
										<button
											type="submit"
											className="admin-button admin-button--primary"
											disabled={broadcastSending || !broadcastTitle.trim() || !broadcastBody.trim()}
										>
											<Send size={15} /> {broadcastSending ? "Sending..." : "Send to all devices"}
										</button>
									</div>
								</div>
								<p>
									Broadcast instant push notifications to all subscribed church members. Choose a <strong>Welcome Message</strong>, <strong>Weekly Church Message</strong>, or <strong>Event Reminder</strong> template below, or type your own custom announcement.
								</p>

								<div className="admin-reminder-templates">
									<div className="admin-template-section">
										<p><strong>🌟 Welcome Message for Subscribers:</strong> <small style={{ color: "#64748b" }}>Send a warm welcome to new or existing subscribers anytime</small></p>
										<div className="admin-reminder-buttons">
											<div className="admin-reminder-group">
												<button
													type="button"
													className="admin-button admin-button--sm"
													onClick={() => setupWelcomeTemplate("standard")}
												>
													👋 Welcome to Testimony House
												</button>
												<button
													type="button"
													className="admin-button admin-button--sm"
													onClick={() => setupWelcomeTemplate("warm")}
												>
													✨ Glad You Are Connected
												</button>
											</div>
										</div>
									</div>

									<div className="admin-template-section">
										<p><strong>⛪ Weekly Church Broadcast Messages:</strong> <small style={{ color: "#64748b" }}>Weekly encouragement, Sunday invites, and prayer points</small></p>
										<div className="admin-reminder-buttons">
											<div className="admin-reminder-group">
												<button
													type="button"
													className="admin-button admin-button--sm"
													onClick={() => setupWeeklyTemplate("sunday")}
												>
													⛪ Sunday Service Invitation
												</button>
												<button
													type="button"
													className="admin-button admin-button--sm"
													onClick={() => setupWeeklyTemplate("midweek")}
												>
													📖 Midweek Digging Deep & Faith Clinic
												</button>
												<button
													type="button"
													className="admin-button admin-button--sm"
													onClick={() => setupWeeklyTemplate("blessing")}
												>
													✨ Weekly Prophetic Blessing
												</button>
												<button
													type="button"
													className="admin-button admin-button--sm"
													onClick={() => setupWeeklyTemplate("weekend")}
												>
													🕊️ Weekend Reflection & Fellowship
												</button>
											</div>
										</div>
									</div>

									{content.events.length ? (
										<div className="admin-template-section">
											<p><strong>📅 Quick Event Reminder Templates:</strong> <small style={{ color: "#64748b" }}>One-click reminder broadcasts for upcoming church events</small></p>
											<div className="admin-reminder-buttons">
												{content.events.map((item, index) => (
													<div key={index} className="admin-reminder-group">
														<span className="admin-reminder-label">{item.title}:</span>
														<button
															type="button"
															className="admin-button admin-button--sm"
															onClick={() => setupReminderTemplate(index, "reminder")}
														>
															Reminder: {item.title}
														</button>
														<button
															type="button"
															className="admin-button admin-button--sm"
															onClick={() => setupReminderTemplate(index, "today")}
														>
															Today: {item.title}
														</button>
														<button
															type="button"
															className="admin-button admin-button--sm"
															onClick={() => setupReminderTemplate(index, "tomorrow")}
														>
															Tomorrow: {item.title}
														</button>
														<button
															type="button"
															className="admin-button admin-button--sm"
															onClick={() => setupReminderTemplate(index, "soon")}
														>
															Happening Soon: {item.title}
														</button>
													</div>
												))}
											</div>
										</div>
									) : null}
								</div>

								<label htmlFor="broadcast-title">
									Notification title
									<input
										id="broadcast-title"
										type="text"
										value={broadcastTitle}
										onChange={(e) => {
											setBroadcastTitle(e.target.value);
											setBroadcastNotice("");
										}}
										placeholder="e.g. Reminder: Youth Sunday or Today: Youth Sunday"
										required
									/>
								</label>

								<label htmlFor="broadcast-body">
									Notification message
									<textarea
										id="broadcast-body"
										rows={4}
										value={broadcastBody}
										onChange={(e) => {
											setBroadcastBody(e.target.value);
											setBroadcastNotice("");
										}}
										placeholder="Enter the reminder message or click a template above..."
										required
									/>
								</label>

								<label htmlFor="broadcast-url">
									Destination link on tap (defaults to /events)
									<input
										id="broadcast-url"
										type="text"
										value={broadcastUrl}
										onChange={(e) => setBroadcastUrl(e.target.value)}
										placeholder="/events"
									/>
								</label>

								{broadcastTitle ? (
									<div className="admin-notification-preview">
										<p className="admin-notification-preview__kicker">PREVIEW ON SUBSCRIBER&apos;S DEVICE</p>
										<div className="admin-notification-preview__card">
											<div className="admin-notification-preview__header">
												<Image
													src="/icons/icon-192.png"
													alt="Church Logo"
													width={18}
													height={18}
													unoptimized
												/>
												<span>Testimony House · now</span>
											</div>
											<h4>{broadcastTitle}</h4>
											<p>{broadcastBody}</p>
										</div>
									</div>
								) : null}

								{broadcastNotice ? (
									<p className="admin-notice" role="status">
										{broadcastNotice}
									</p>
								) : null}
								{broadcastError ? (
									<p className="admin-notice admin-notice--error" role="alert">
										{broadcastError}
									</p>
								) : null}
							</form>

							<div className="admin-panel admin-panel--wide">
								<div className="admin-panel__heading">
									<div><p className="section-kicker">OPT-IN BROWSER DEVICES</p><h2>Notification subscribers</h2></div>
									<button type="button" className="admin-button" onClick={() => void loadPushSubscriptions()} disabled={pushSubscriptionsLoading}>
										{pushSubscriptionsLoading ? "Refreshing..." : "Refresh list"}
									</button>
								</div>
								<p className="admin-notification-help">These devices have opted in to new sermon announcements, event reminders, and livestream alerts. No names, email addresses, or browser subscription details are shown here.</p>
								<div className="admin-notification-count"><Bell size={18} /><span>Subscribed devices</span><strong>{pushSubscriptions.length}</strong></div>
								{pushSubscriptionsLoading ? <p className="admin-notice" role="status">Loading subscribed devices...</p> : null}
								{pushSubscriptionsError ? <p className="admin-notice admin-notice--error" role="alert">{pushSubscriptionsError}</p> : null}
								{!pushSubscriptionsLoading && !pushSubscriptionsError ? (
									<div className="admin-table-wrap">
										<table className="admin-membership-table">
											<thead><tr><th>Device</th><th>Subscribed since</th><th>Last updated</th></tr></thead>
											<tbody>
												{pushSubscriptions.length ? pushSubscriptions.map((subscription, index) => (
													<tr key={subscription.id}>
														<td>Subscribed device {pushSubscriptions.length - index}</td>
														<td>{new Date(subscription.createdAt).toLocaleString()}</td>
														<td>{new Date(subscription.updatedAt).toLocaleString()}</td>
													</tr>
												)) : <tr><td colSpan={3}>No devices have subscribed to notifications yet.</td></tr>}
											</tbody>
										</table>
									</div>
								) : null}
							</div>
						</div>
					) : activeSection === "memberships" ? (
						<div className="admin-panel admin-panel--wide">
							<div className="admin-panel__heading"><div><p className="section-kicker">MEMBERSHIP DATA</p><h2>Submissions</h2></div><button type="button" className="admin-button" onClick={() => { setMembershipStatus("All"); setMembershipFrom(""); setMembershipTo(""); }}><CalendarDays size={15} /> Reset filters</button></div>
							<div className="admin-membership-filters">
								<label>
									Status
									<select value={membershipStatus} onChange={(event) => setMembershipStatus(event.target.value)}>
										<option>All</option>
										<option>New</option>
										<option>Review</option>
										<option>Approved</option>
										<option>Rejected</option>
									</select>
								</label>
								<label>Date from<input type="date" value={membershipFrom} onChange={(event) => setMembershipFrom(event.target.value)} /></label>
								<label>Date to<input type="date" value={membershipTo} onChange={(event) => setMembershipTo(event.target.value)} /></label>
							</div>
							{membershipLoading ? <p className="admin-notice" role="status">Loading membership entries...</p> : null}
							{membershipError ? <p className="admin-notice admin-notice--error" role="alert">{membershipError}</p> : null}
							{!membershipLoading && !membershipError ? (
								<div className="admin-table-wrap">
									<table className="admin-membership-table">
										<thead>
											<tr>
												<th>Date submitted</th>
												<th>Status</th>
												<th>Name</th>
												<th>Category</th>
												<th>Phone</th>
												<th>Email</th>
											</tr>
										</thead>
										<tbody>
											{membershipRows.length ? membershipRows.map((entry, index) => (
												<tr key={`${entry["Submitted At"] ?? index}-${index}`}>
													<td>{entry["Submitted At"] ? new Date(String(entry["Submitted At"])).toLocaleString() : "—"}</td>
													<td><span className={`admin-membership-status admin-membership-status--${String(entry.Status || "New").toLowerCase()}`}>{entry.Status || "New"}</span></td>
													<td>{[entry["First Name"], entry["Surname"]].filter(Boolean).join(" ") || "—"}</td>
													<td>{entry.Category || "—"}</td>
													<td>{entry["Telephone / WhatsApp"] || "—"}</td>
													<td>{entry["Email Address"] || "—"}</td>
												</tr>
											)) : (
												<tr><td colSpan={6}>No membership entries match the selected filter.</td></tr>
											)}
										</tbody>
									</table>
								</div>
							) : null}
						</div>
					) : (
						<form className="admin-panel admin-editor" onSubmit={saveContent}>
							<div className="admin-panel__heading"><div><p className="section-kicker">PUBLISHED WEBSITE CONTENT</p><h2>{sections.find((section) => section.id === activeSection)?.label}</h2></div><button className="admin-button admin-button--primary" disabled={contentLoading || contentSaving || Boolean(contentError)} type="submit"><Save size={15} /> {contentSaving ? "Saving..." : "Save and publish"}</button></div>
							{activeSection === "pages" ? <>
								<fieldset><legend>Homepage</legend><label>Hero headline<input value={content.pages.homeHeading} onChange={(event) => updatePageContent("homeHeading", event.currentTarget.value)} required /></label><label>Hero description<textarea value={content.pages.homeDescription} onChange={(event) => updatePageContent("homeDescription", event.currentTarget.value)} rows={3} required /></label><label>Welcome heading<input value={content.pages.welcomeHeading} onChange={(event) => updatePageContent("welcomeHeading", event.currentTarget.value)} required /></label><label>Welcome description<textarea value={content.pages.welcomeDescription} onChange={(event) => updatePageContent("welcomeDescription", event.currentTarget.value)} rows={3} required /></label></fieldset>
								<fieldset><legend>Sermons page</legend><label>Introduction<textarea value={content.pages.sermonDescription} onChange={(event) => updatePageContent("sermonDescription", event.currentTarget.value)} rows={3} required /></label></fieldset>
							</> : activeSection === "services" ? <fieldset><legend>Sunday services</legend><label>Service heading<input value={content.services.day} onChange={(event) => { const day = event.currentTarget.value; setContent((current) => ({ ...current, services: { ...current.services, day } })); }} required /></label>{content.services.schedule.map((item, index) => <div className="admin-editor__row" key={index}><label>Service name<input value={item.label} onChange={(event) => updateServiceSchedule(index, "label", event.currentTarget.value)} required /></label><label>Time<input value={item.time} onChange={(event) => updateServiceSchedule(index, "time", event.currentTarget.value)} required /></label></div>)}<label>Church address<textarea value={content.services.address} onChange={(event) => { const address = event.currentTarget.value; setContent((current) => ({ ...current, services: { ...current.services, address } })); }} rows={2} required /></label></fieldset> : activeSection === "events" ? <fieldset><legend>Upcoming events</legend><button type="button" className="admin-button" onClick={addEvent}><CalendarDays size={15} /> Add event</button>{content.events.map((item, index) => <div className="admin-editor__entry" key={`${item.date}-${index}`}><div className="admin-editor__row"><label>Event title<input value={item.title} onChange={(event) => updateEvent(index, "title", event.currentTarget.value)} required /></label><label>Date<input type="date" value={item.date} onChange={(event) => updateEvent(index, "date", event.currentTarget.value)} required /></label><label>Time<input value={item.time} onChange={(event) => updateEvent(index, "time", event.currentTarget.value)} required /></label></div><label>Event flyer (JPEG, PNG, WebP, or GIF; max 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void uploadImage(event, `event-${index}`, (image) => updateEvent(index, "image", image))} disabled={Boolean(uploadingImage)} /></label>{item.image ? <div className="admin-image-preview"><Image className="admin-image-preview__img" src={item.image} alt={`${item.title || "Event"} flyer preview`} width={480} height={270} unoptimized /><button type="button" className="admin-button" onClick={() => updateEvent(index, "image", "")}>Remove flyer</button></div> : <div className="admin-image-placeholder"><ImagePlus size={22} /><span>Event flyer preview will appear here</span></div>}{uploadingImage === `event-${index}` ? <p role="status">Uploading flyer...</p> : null}<label>Presented by<textarea value={item.organizer} onChange={(event) => updateEvent(index, "organizer", event.currentTarget.value)} rows={3} required /></label><div className="admin-editor__row"><label>Theme<input value={item.theme} onChange={(event) => updateEvent(index, "theme", event.currentTarget.value)} required /></label><label>Scripture<input value={item.scripture} onChange={(event) => updateEvent(index, "scripture", event.currentTarget.value)} required /></label><label>Case study<input value={item.caseStudy} onChange={(event) => updateEvent(index, "caseStudy", event.currentTarget.value)} required /></label></div><label>Featuring (one item per line)<textarea value={item.featuring.join("\n")} onChange={(event) => updateEvent(index, "featuring", event.currentTarget.value)} rows={4} required /></label><label>Location (optional)<input value={item.location} onChange={(event) => updateEvent(index, "location", event.currentTarget.value)} /></label><label>Additional details (optional)<textarea value={item.description} onChange={(event) => updateEvent(index, "description", event.currentTarget.value)} rows={3} /></label><button type="button" className="admin-button" onClick={() => removeEvent(index)}>Remove event</button></div>)}</fieldset> : null}
							{activeSection === "sermons" ? <fieldset><legend>Sermon records</legend><button type="button" className="admin-button" onClick={addSermon}><BookOpen size={15} /> Add sermon</button>{content.sermons.map((sermon, index) => <div className="admin-editor__entry" key={`${sermon.date}-${sermon.service}-${index}`}><div className="admin-editor__row"><label>Sermon date<input type="date" value={sermon.date} onChange={(event) => updateSermon(index, "date", event.currentTarget.value)} required /></label><label>Service<input value={sermon.service} onChange={(event) => updateSermon(index, "service", event.currentTarget.value)} required /></label><label>Sermon title<input value={sermon.title} onChange={(event) => updateSermon(index, "title", event.currentTarget.value)} required /></label></div><label>Sermon image (JPEG, PNG, WebP, or GIF; max 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void uploadImage(event, `sermon-${index}`, (image) => updateSermon(index, "image", image))} disabled={Boolean(uploadingImage)} /></label>{sermon.image ? <div className="admin-image-preview"><Image className="admin-image-preview__img" src={sermon.image} alt={`${sermon.title || "Sermon"} image preview`} width={480} height={270} unoptimized /><button type="button" className="admin-button" onClick={() => updateSermon(index, "image", "")}>Remove image</button></div> : <div className="admin-image-placeholder"><ImagePlus size={22} /><span>Sermon image placeholder</span></div>}{uploadingImage === `sermon-${index}` ? <p role="status">Uploading image...</p> : null}<div className="admin-editor__row"><label>Speaker<input value={sermon.speaker} onChange={(event) => updateSermon(index, "speaker", event.currentTarget.value)} required /></label><label>Topic<input value={sermon.topic} onChange={(event) => updateSermon(index, "topic", event.currentTarget.value)} required /></label></div><label>Scripture references (one per line)<textarea value={sermon.scriptures.join("\n")} onChange={(event) => updateSermon(index, "scriptures", event.currentTarget.value)} rows={3} /></label><label>Sermon summary<textarea value={sermon.summary} onChange={(event) => updateSermon(index, "summary", event.currentTarget.value)} rows={4} required /></label><label>Sermon notes (one per line)<textarea value={sermon.points.join("\n")} onChange={(event) => updateSermon(index, "points", event.currentTarget.value)} rows={4} /></label><label>Prayer points (one per line)<textarea value={sermon.prayerPoints.join("\n")} onChange={(event) => updateSermon(index, "prayerPoints", event.currentTarget.value)} rows={3} /></label><button type="button" className="admin-button" onClick={() => removeSermon(index)}>Remove sermon</button></div>)}</fieldset> : null}
							{notice ? <p className="admin-notice" role="status">{notice}</p> : null}
							{contentError ? <p className="admin-notice admin-notice--error" role="alert">{contentError}</p> : null}
						</form>
					)}
				</div>
			</div>
		</section>
	);
}