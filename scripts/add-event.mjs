import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
	console.error("DATABASE_URL is required.");
	process.exit(1);
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	connectionTimeoutMillis: 10_000,
});

const newEvent = {
	title: "Youth Sunday",
	date: "2026-10-18",
	time: "1st Service: 7:50 AM · 2nd Service: 10:00 AM",
	organizer: "THE REDEEMED CHRISTIAN CHURCH OF GOD · LAGOS PROVINCE 103 · TESTIMONY HOUSE YOUTH",
	theme: "Intimacy with God",
	scripture: "James 2:23",
	caseStudy: "Abraham as a Case Study",
	featuring: [
		"The Word",
		"Prayer",
		"Praise & Worship",
		"Spoken Word",
	],
	location: "11, Odu-Onikosi Avenue, Opposite LASUED, Otto-Awori, Lagos",
	description:
		"Join the Testimony House Youth for an inspiring Youth Sunday service themed 'Intimacy with God'. Learn from the life and faith of Abraham as we pursue a deeper, closer walk with the Lord.\n\nMinisters:\n• Pastor Yomi Lawson (PIC-Zone)\n• Pastor Olusegun Macaulay (PICP, LP 103)\n• Pastor E.A. Adeboye (General Overseer)",
};

try {
	const res = await pool.query("SELECT content FROM website_content WHERE singleton = true");
	if (res.rows.length === 0 || !res.rows[0].content) {
		console.error("No website_content row found.");
		process.exit(1);
	}

	const currentContent = res.rows[0].content;
	// Replace existing event if title & date match, or prepend to events list
	const filteredEvents = (currentContent.events || []).filter(
		(e) => !(e.title === newEvent.title && e.date === newEvent.date),
	);
	currentContent.events = [newEvent, ...filteredEvents];

	await pool.query(
		`INSERT INTO website_content (singleton, content, updated_at)
		 VALUES (TRUE, $1::jsonb, NOW())
		 ON CONFLICT (singleton) DO UPDATE
		 SET content = EXCLUDED.content, updated_at = NOW()`,
		[JSON.stringify(currentContent)],
	);

	console.log("Successfully added Youth Sunday event to the database!");
	console.log("Total events in DB:", currentContent.events.length);
} catch (error) {
	console.error("Error inserting event:", error);
	process.exit(1);
} finally {
	await pool.end();
}
