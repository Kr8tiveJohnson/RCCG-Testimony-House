"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";

export function AdminLogin({ configurationRequired = false }: { configurationRequired?: boolean }) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function signIn(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			const response = await fetch("/api/admin/session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});
			const result = await response.json() as { success?: boolean; error?: string };
			if (!response.ok || !result.success) throw new Error(result.error || "Could not sign in.");
			window.location.reload();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not sign in.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="admin-page page-width">
			<header className="admin-page__header">
				<div><p className="section-kicker">TESTIMONY HOUSE</p><h1>Website admin</h1></div>
			</header>
			<form className="admin-login admin-panel" onSubmit={signIn}>
				<span className="admin-login__icon"><LockKeyhole size={21} /></span>
				<div><h2>Admin sign-in</h2><p>Sign in to manage published church website content.</p></div>
				{configurationRequired ? (
					<p className="admin-notice admin-notice--error" role="status">
						Admin sign-in is not configured. Set a server-side LIVESTREAM_ADMIN_PASSWORD of at least 16 characters, then restart or redeploy the website.
					</p>
				) : <>
					<label htmlFor="admin-password">Admin password</label>
					<input
						autoComplete="current-password"
						id="admin-password"
						onChange={(event) => setPassword(event.currentTarget.value)}
						required
						type="password"
						value={password}
					/>
				</>}
				{error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}
				{configurationRequired ? null : (
					<button className="admin-button admin-button--primary" disabled={loading} type="submit">
						{loading ? "Signing in..." : "Sign in"}
					</button>
				)}
			</form>
		</section>
	);
}
