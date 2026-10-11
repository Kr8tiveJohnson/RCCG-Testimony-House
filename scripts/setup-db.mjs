import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const schema = await readFile(resolve(scriptDirectory, "../database/schema.sql"), "utf8");

if (!process.env.DATABASE_URL) {
	throw new Error("Set DATABASE_URL before running the database setup.");
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	connectionTimeoutMillis: 5_000,
});

try {
	await pool.query(schema);
	console.info("PostgreSQL schema is ready.");
} finally {
	await pool.end();
}
