export default function Loading() {
	return (
		<section className="route-loading page-width" role="status" aria-live="polite">
			<span className="route-loading__spinner" aria-hidden="true" />
			<p>Loading page…</p>
		</section>
	);
}