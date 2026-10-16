import "server-only";
import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & {
	postgresPool?: Pool;
};

export function isPostgresConfigured(): boolean {
	return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "");
}

export function getPostgresPool() {
	if (globalForPostgres.postgresPool) return globalForPostgres.postgresPool;

	const connectionString = process.env.DATABASE_URL?.trim();
	if (!connectionString) {
		throw new Error("DATABASE_URL is not configured for the PostgreSQL database.");
	}

	const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
	const disableSsl = process.env.DATABASE_SSL === "false";
	const useSsl = !isLocal && !disableSsl;

	const pool = new Pool({
		connectionString,
		max: 5,
		connectionTimeoutMillis: 5_000,
		idleTimeoutMillis: 30_000,
		...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
	});

	globalForPostgres.postgresPool = pool;
	return pool;
}
