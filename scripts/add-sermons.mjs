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

const sermon1 = {
	date: "2026-10-11",
	service: "1st Service",
	title: "Divine Restoration",
	topic: "Divine Restoration",
	speaker: "Pastor Omolara Macaulay",
	scriptures: [
		"Deuteronomy 1:26",
		"Psalm 126:1-6",
		"Jeremiah 30:7",
		"Romans 8",
		"Job 42:10",
		"Jeremiah 33:11",
		"Daniel 4:36",
	],
	summary:
		"Restoration is returning someone or something back to their original, God-given position. God is able to restore individuals, families, and even nations back to their former glory. No matter what trials or storms you face, never lose your connection with God. Job lost everything he had, yet he remained steadfast in his relationship with the Lord, and God restored him with double honor. As believers, the Scripture calls us to contend in faith—we cannot remain passive when God has promised complete restoration.",
	points: [
		"Restoration is the divine act of returning a person or situation back to its original, God-ordained standing (Psalm 126:1-6).",
		"God has the power to restore our nation, Nigeria, to her rightful glory and peace (Jeremiah 30:7, Jeremiah 33:11).",
		"Never lose your connection with God in seasons of adversity; unbroken fellowship is the key to recovery (Romans 8).",
		"Job endured catastrophic loss, yet he held fast to God and was blessed with twice what he lost (Job 42:10).",
		"The Bible calls us to contend in faith—we must stand on God's word and actively lay hold of our breakthrough (Daniel 4:36).",
		"God makes the ultimate difference in every battle: He is the Almighty, All-Sufficient God.",
	],
	prayerPoints: [
		"Father, every good thing, virtue, and opportunity that has been taken away from my life, restore back to me in double fold.",
		"Father, restore the glory, peace, and prosperity of Nigeria according to Your promise in Jeremiah 33:11.",
		"Lord Almighty, uphold me by Your sufficient grace and let Your favor restore every area of my destiny.",
	],
};

const sermon2 = {
	date: "2026-10-11",
	service: "2nd Service",
	title: "Divine Restoration Through Prayer",
	topic: "Divine Restoration",
	speaker: "Pastor Yomi Peter",
	scriptures: [
		"1 Thessalonians 5:17",
		"Luke 18:1",
		"John 10:10",
		"Ephesians 1:3",
		"Psalm 119:89",
	],
	summary:
		"Prayer is the spiritual lifeline of every believer. When a Christian stops praying, it is an urgent indicator that something is spiritually amiss. The more we pray, the more spiritual power and divine alignment we generate. Scripture commands that men ought always to pray and not faint. When God manifested in the flesh as Jesus Christ, He prioritized prayer to interact with the spiritual realm and establish God's will on earth. When we cease praying, we forfeit the power to birth prophecy and leave our lives vulnerable to the enemy.",
	points: [
		"Prayer is the essential lifeline of the believer; consistent prayer generates spiritual fire and power (1 Thessalonians 5:17).",
		"Three critical consequences of prayerlessness: (1) We faint and become spiritually weak (Luke 18:1); (2) Spiritual and physical decay set in because the adversary comes to steal, kill, and destroy (John 10:10); (3) Prophecy remains unfulfilled.",
		"Prophecy is a spiritual seed that must be nurtured through consistent prayer before it can germinate and manifest in reality.",
		"Wake up in the night watches to pray and send your petitions ahead into your future.",
		"Spiritual communication precedes physical manifestation: once a matter is settled in the spiritual realm through prayer, it begins to manifest physically.",
		"When Jesus walked the earth, He prayed continually—if the Son of God needed to pray, how much more do we need constant communion with the Father?",
		"Ceasing to pray means cheating yourself out of the spiritual blessings already established in heavenly places (Ephesians 1:3, Psalm 119:89).",
		"When a man disconnects from God through prayerlessness, life becomes a confusing struggle.",
	],
	prayerPoints: [
		"Father, ignite and activate my prayer life with fresh spiritual fire today.",
		"Lord, deliver me from spiritual lethargy and empower me to pray consistently without fainting (Luke 18:1).",
		"Father, let every prophetic word and promise spoken over my destiny receive life and manifest in Jesus' name.",
	],
};

try {
	const res = await pool.query("SELECT content FROM website_content WHERE singleton = true");
	let currentContent;
	if (res.rows.length > 0 && res.rows[0].content) {
		currentContent = res.rows[0].content;
	} else {
		console.log("No existing content found, using defaults");
		process.exit(1);
	}

	// Filter out any older duplicate sermons with same title/service if existing
	const existingSermons = (currentContent.sermons || []).filter(
		(s) => !(s.service === sermon1.service && s.topic === sermon1.topic) &&
		       !(s.service === sermon2.service && s.topic === sermon2.topic)
	);

	currentContent.sermons = [sermon1, sermon2, ...existingSermons];

	await pool.query(
		`INSERT INTO website_content (singleton, content, updated_at)
		 VALUES (TRUE, $1::jsonb, NOW())
		 ON CONFLICT (singleton) DO UPDATE
		 SET content = EXCLUDED.content, updated_at = NOW()`,
		[JSON.stringify(currentContent)],
	);

	console.log("Successfully added both sermons to the database!");
	console.log("Total sermons in DB now:", currentContent.sermons.length);
} catch (error) {
	console.error("Error inserting sermons:", error);
	process.exit(1);
} finally {
	await pool.end();
}
