import "server-only";
import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & {
	postgresPool?: Pool;
};

export function getPostgresPool() {
	if (globalForPostgres.postgresPool) return globalForPostgres.postgresPool;

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not configured for the PostgreSQL database.");
	}

	const pool = new Pool({
		connectionString,
		max: 5,
		connectionTimeoutMillis: 5_000,
		idleTimeoutMillis: 30_000,
	});

	globalForPostgres.postgresPool = pool;
	return pool;
}
