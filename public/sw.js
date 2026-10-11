self.addEventListener("install", (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
	let notification = {
		title: "RCCG Testimony House",
		body: "There is a new update from Testimony House.",
		url: "/",
	};

	if (event.data) {
		try {
			notification = { ...notification, ...event.data.json() };
		} catch {
			notification.body = event.data.text();
		}
	}

	event.waitUntil(self.registration.showNotification(notification.title, {
		body: notification.body,
		icon: "/icons/icon-192.png",
		badge: "/icons/icon-192.png",
		data: { url: notification.url },
	}));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
	event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
		const existing = clients.find((client) => client.url === url);
		if (existing) return existing.focus();
		return self.clients.openWindow(url);
	}));
});
