"use client";

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	BookOpen,
	CalendarDays,
	ChartNoAxesCombined,
	Church,
	Clock3,
	FileText,
	Save,
	UsersRound,
} from "lucide-react";

const sections = [
	{ id: "overview", label: "Overview", icon: Church },
	{ id: "pages", label: "Page content", icon: FileText },
	{ id: "services", label: "Sunday services", icon: Clock3 },
	{ id: "ministries", label: "Ministries & events", icon: UsersRound },
	{ id: "memberships", label: "Memberships", icon: UsersRound },
	{ id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
] as const;

type SectionId = (typeof sections)[number]["id"];
type Draft = {
	homeHeading: string;
	homeDescription: string;
	aboutText: string;
	primaryCta: string;
	sermonDescription: string;
	testimonyDescription: string;
	prayerDescription: string;
	givingDescription: string;
	livestreamDescription: string;
	privacySummary: string;
	contactEmail: string;
	contactPhone: string;
	prayerTime: string;
	schoolTime: string;
	serviceTime: string;
	serviceAddress: string;
	eventTitle: string;
	eventDescription: string;
	ministrySummary: string;
};

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

const initialDraft: Draft = {
	homeHeading: "WELCOME TO TESTIMONY HOUSE",
	homeDescription: "A welcoming church family where faith grows, hope is renewed, and every story matters.",
	aboutText: "A church family learning to follow Jesus, care for one another, and make room for every generation to grow.",
	primaryCta: "Membership form",
	sermonDescription: "Sermons and teaching from RCCG Testimony House.",
	testimonyDescription: "Stories of faith, hope, and new beginnings from our church family.",
	prayerDescription: "A private place to share a prayer request with the church.",
	givingDescription: "Giving information for supporting the work of the church.",
	livestreamDescription: "Watch RCCG Testimony House services online.",
	privacySummary: "How the church handles information shared through this website.",
	contactEmail: "rccglp103@gmail.com",
	contactPhone: "0706 715 6156",
	prayerTime: "7:00 AM",
	schoolTime: "8:00 AM",
	serviceTime: "9:00 AM",
	serviceAddress: "11, Odu-Onikosi Avenue, Opposite Lasued, Otto-Awori, Lagos.",
	eventTitle: "There’s always room at the table.",
	eventDescription: "Upcoming gatherings and event details will be shared here.",
	ministrySummary: "Children; Teens & Youth; Young Adults; Men & Women; Choir & Music; Evangelism & Media",
};

const visits = [34, 48, 41, 61, 55, 74, 63, 82, 69, 91, 78, 100];

function Metric({ label, value, change, icon: Icon }: { label: string; value: string; change: string; icon: typeof Activity }) {
	return (
		<article className="admin-metric">
			<div className="admin-metric__top"><span>{label}</span><Icon size={17} /></div>
			<strong>{value}</strong>
			<span className="admin-metric__change"><ArrowUpRight size={13} /> {change}</span>
		</article>
	);
}

export function AdminDashboard() {
	const [activeSection, setActiveSection] = useState<SectionId>("overview");
	const [timeRange, setTimeRange] = useState("7 days");
	const [draft, setDraft] = useState(initialDraft);
	const [notice, setNotice] = useState("");
	const [membershipRows, setMembershipRows] = useState<MembershipEntry[]>([]);
	const [membershipStatus, setMembershipStatus] = useState("All");
	const [membershipFrom, setMembershipFrom] = useState("");
	const [membershipTo, setMembershipTo] = useState("");
	const [membershipLoading, setMembershipLoading] = useState(false);
	const [membershipError, setMembershipError] = useState("");

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

	function updateDraft(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = event.currentTarget;
		setDraft((current) => ({ ...current, [name]: value }));
		setNotice("");
	}

	function showPreviewNotice(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setNotice("Preview only. Changes are not published or saved to the live website.");
	}

	return (
		<section className="admin-page page-width">
			<header className="admin-page__header">
				<div><p className="section-kicker">TESTIMONY HOUSE</p><h1>Website admin</h1></div>
				<span className="admin-prototype"><span /> PROTOTYPE</span>
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
							<div className="admin-panel__heading"><div><p className="section-kicker">OVERVIEW</p><h2>Good morning</h2></div><button type="button" className="admin-button" onClick={() => setActiveSection("pages")}><FileText size={15} /> Edit page content</button></div>
							<div className="admin-metrics">
								<Metric label="Page views" value="1,284" change="12.8%" icon={Activity} />
								<Metric label="New visitors" value="936" change="8.2%" icon={UsersRound} />
								<Metric label="Form interest" value="42" change="5.4%" icon={FileText} />
							</div>
							<div className="admin-chart-panel">
								<div className="admin-chart-panel__heading"><div><h3>Website visits</h3><p>Illustrative sample data</p></div><span>LAST 7 DAYS</span></div>
								<div className="admin-bar-chart" role="img" aria-label="Illustrative website visits chart">
									{visits.map((value, index) => <span key={index} style={{ height: `${value}%` }} />)}
								</div>
								<div className="admin-chart-panel__axis"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
							</div>
							<div className="admin-activity">
								<div className="admin-activity__heading"><h3>Site snapshot</h3><span>DEMO CONTENT</span></div>
								<div><BookOpen size={16} /><span>Ministries listed</span><strong>6</strong></div>
								<div><CalendarDays size={16} /><span>Upcoming public events</span><strong>0</strong></div>
							</div>
							<p className="admin-disclaimer">Analytics figures are examples only. Visitor tracking is not connected.</p>
						</div>
					) : activeSection === "analytics" ? (
						<div className="admin-panel">
							<div className="admin-panel__heading"><div><p className="section-kicker">REPORTING</p><h2>Analytics</h2></div><div className="admin-range" role="group" aria-label="Analytics date range">{["7 days", "30 days", "12 months"].map((range) => <button type="button" key={range} className={timeRange === range ? "admin-range__active" : ""} aria-pressed={timeRange === range} onClick={() => setTimeRange(range)}>{range}</button>)}</div></div>
							<div className="admin-metrics">
								<Metric label="Visits" value={timeRange === "7 days" ? "1,284" : timeRange === "30 days" ? "4,812" : "48,204"} change="12.8%" icon={Activity} />
								<Metric label="Visitors" value={timeRange === "7 days" ? "936" : timeRange === "30 days" ? "3,604" : "36,118"} change="8.2%" icon={UsersRound} />
								<Metric label="Engagement" value="2m 18s" change="4.1%" icon={Clock3} />
							</div>
							<div className="admin-chart-panel admin-chart-panel--large">
								<div className="admin-chart-panel__heading"><div><h3>Traffic overview</h3><p>Illustrative sample data · {timeRange}</p></div><span><ArrowDownRight size={14} /> DEMO</span></div>
								<div className="admin-bar-chart" role="img" aria-label={`Illustrative visitor traffic over ${timeRange}`}>
									{[...visits, ...visits.slice(2, 8)].map((value, index) => <span key={index} style={{ height: `${value}%` }} />)}
								</div>
							</div>
							<p className="admin-disclaimer">This preview is not connected to Google Analytics or any visitor tracking service.</p>
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
						<form className="admin-panel admin-editor" onSubmit={showPreviewNotice}>
							<div className="admin-panel__heading"><div><p className="section-kicker">CONTENT CONTROLS</p><h2>{sections.find((section) => section.id === activeSection)?.label}</h2></div><button className="admin-button admin-button--primary" type="submit"><Save size={15} /> Save preview</button></div>
							{activeSection === "pages" ? <>
								<fieldset><legend>Homepage</legend><label>Hero headline<input name="homeHeading" value={draft.homeHeading} onChange={updateDraft} /></label><label>Welcome description<textarea name="homeDescription" value={draft.homeDescription} onChange={updateDraft} rows={3} /></label><label>Primary action label<input name="primaryCta" value={draft.primaryCta} onChange={updateDraft} /></label></fieldset>
								<fieldset><legend>About page</legend><label>Church introduction<textarea name="aboutText" value={draft.aboutText} onChange={updateDraft} rows={3} /></label></fieldset>
								<fieldset><legend>Other public pages</legend><label>Sermons introduction<textarea name="sermonDescription" value={draft.sermonDescription} onChange={updateDraft} rows={2} /></label><label>Testimonies introduction<textarea name="testimonyDescription" value={draft.testimonyDescription} onChange={updateDraft} rows={2} /></label><label>Prayer request introduction<textarea name="prayerDescription" value={draft.prayerDescription} onChange={updateDraft} rows={2} /></label><label>Giving information<textarea name="givingDescription" value={draft.givingDescription} onChange={updateDraft} rows={2} /></label><label>Livestream introduction<textarea name="livestreamDescription" value={draft.livestreamDescription} onChange={updateDraft} rows={2} /></label><label>Privacy policy summary<textarea name="privacySummary" value={draft.privacySummary} onChange={updateDraft} rows={2} /></label></fieldset>
								<fieldset><legend>Contact details</legend><label>Church email<input name="contactEmail" type="email" value={draft.contactEmail} onChange={updateDraft} /></label><label>Church phone<input name="contactPhone" type="tel" value={draft.contactPhone} onChange={updateDraft} /></label></fieldset>
							</> : activeSection === "services" ? <fieldset><legend>Sunday worship</legend><div className="admin-editor__row"><label>Workers Prayer &amp; Training<input name="prayerTime" value={draft.prayerTime} onChange={updateDraft} /></label><label>Sunday School<input name="schoolTime" value={draft.schoolTime} onChange={updateDraft} /></label><label>Service starts<input name="serviceTime" value={draft.serviceTime} onChange={updateDraft} /></label></div><label>Church address<textarea name="serviceAddress" value={draft.serviceAddress} onChange={updateDraft} rows={2} /></label></fieldset> : <>
								<fieldset><legend>Ministries</legend><label>Ministry names<textarea name="ministrySummary" value={draft.ministrySummary} onChange={updateDraft} rows={3} /></label></fieldset>
								<fieldset><legend>Events</legend><label>Featured event title<input name="eventTitle" value={draft.eventTitle} onChange={updateDraft} /></label><label>Event summary<textarea name="eventDescription" value={draft.eventDescription} onChange={updateDraft} rows={3} /></label></fieldset>
							</>}
							{notice ? <p className="admin-notice" role="status">{notice}</p> : null}
						</form>
					)}
				</div>
			</div>
		</section>
	);
}