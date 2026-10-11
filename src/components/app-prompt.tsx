"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bell, Download, X } from "lucide-react";

type InstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function decodeApplicationServerKey(key: string) {
	const padding = "=".repeat((4 - key.length % 4) % 4);
	const base64 = (key + padding).replace(/-/g, "+").replace(/_/g, "/");
	const raw = atob(base64);
	return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export function AppPrompt() {
	const pathname = usePathname();
	const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [pushSupported, setPushSupported] = useState(false);
	const [pushSubscribed, setPushSubscribed] = useState(false);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState("");
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		const updateBrowserCapabilities = () => {
			setDismissed(window.sessionStorage.getItem("rccg-app-prompt-dismissed") === "true");
			setPushSupported("Notification" in window && "serviceWorker" in navigator && "PushManager" in window);
			const standalone = window.matchMedia("(display-mode: standalone)").matches ||
				("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
			setIsInstalled(standalone);
		};
		const capabilityTimer = window.setTimeout(updateBrowserCapabilities, 0);
		const handleInstallAvailable = (event: Event) => {
			event.preventDefault();
			setInstallPrompt(event as InstallPromptEvent);
		};
		const handleInstalled = () => {
			setIsInstalled(true);
			setInstallPrompt(null);
			setMessage("Testimony House is installed on your device.");
		};
		window.addEventListener("beforeinstallprompt", handleInstallAvailable);
		window.addEventListener("appinstalled", handleInstalled);

		if ("serviceWorker" in navigator) {
			void navigator.serviceWorker.register("/sw.js").then(async (registration) => {
				updateBrowserCapabilities();
				const subscription = await registration.pushManager?.getSubscription();
				setPushSubscribed(Boolean(subscription) && "Notification" in window && Notification.permission === "granted");
			}).catch((error: unknown) => {
				console.error("Could not register the website app service worker.", error);
				setMessage("App features could not be started. Refresh the page and try again.");
			});
		}

		return () => {
			window.clearTimeout(capabilityTimer);
			window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
			window.removeEventListener("appinstalled", handleInstalled);
		};
	}, []);

	const handleInstall = useCallback(async () => {
		if (!installPrompt) {
			setMessage(/iPhone|iPad|iPod/i.test(navigator.userAgent)
				? "In Safari, tap Share, then choose Add to Home Screen."
				: "Use your browser menu and choose Install app or Add to Home screen.");
			return;
		}
		await installPrompt.prompt();
		const choice = await installPrompt.userChoice;
		if (choice.outcome === "accepted") setMessage("Installing Testimony House...");
		setInstallPrompt(null);
	}, [installPrompt]);

	const handleNotifications = useCallback(async () => {
		setBusy(true);
		setMessage("");
		try {
			const registration = await navigator.serviceWorker.register("/sw.js");
			if (pushSubscribed) {
				const subscription = await registration.pushManager.getSubscription();
				if (subscription) {
					const response = await fetch("/api/push/subscriptions", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ endpoint: subscription.endpoint }),
					});
					const result = await response.json() as { success?: boolean; error?: string };
					if (!response.ok || !result.success) throw new Error(result.error || "Could not turn off notifications.");
					await subscription.unsubscribe();
				}
				setPushSubscribed(false);
				setMessage("Church notifications are turned off.");
				return;
			}

			if (Notification.permission === "denied") {
				throw new Error("Notifications are blocked in your browser settings. Allow them there, then try again.");
			}
			const permission = await Notification.requestPermission();
			if (permission !== "granted") throw new Error("Notifications were not enabled.");

			const keyResponse = await fetch("/api/push/public-key", { cache: "no-store" });
			const keyResult = await keyResponse.json() as { success?: boolean; publicKey?: string; error?: string };
			if (!keyResponse.ok || !keyResult.success || !keyResult.publicKey) {
				throw new Error(keyResult.error || "Church notifications are not ready yet.");
			}

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: decodeApplicationServerKey(keyResult.publicKey),
			});
			const response = await fetch("/api/push/subscriptions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(subscription),
			});
			const result = await response.json() as { success?: boolean; error?: string };
			if (!response.ok || !result.success) throw new Error(result.error || "Could not enable church notifications.");
			setPushSubscribed(true);
			setMessage("You’re subscribed to sermon announcements and event reminders.");
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Could not update notification settings.");
		} finally {
			setBusy(false);
		}
	}, [pushSubscribed]);

	if (pathname === "/admin" || dismissed || (isInstalled && !pushSupported)) return null;

	return (
		<aside className="app-prompt" aria-label="Install app and church notifications">
			<button
				type="button"
				className="app-prompt__close"
				aria-label="Dismiss app options"
				onClick={() => {
					window.sessionStorage.setItem("rccg-app-prompt-dismissed", "true");
					setDismissed(true);
				}}
			><X size={16} /></button>
			<p className="app-prompt__kicker">STAY CONNECTED</p>
			<h2>Testimony House, wherever you go.</h2>
			<p className="app-prompt__description">{isInstalled
				? "Get reminders for upcoming events and new sermons."
				: "Install our app and get reminders for upcoming events and new sermons."}</p>
			<div className="app-prompt__actions">
				{!isInstalled ? <button type="button" className="app-prompt__button app-prompt__button--primary" onClick={() => void handleInstall()}>
					<Download size={16} /> Install app
				</button> : null}
				{pushSupported ? <button type="button" className="app-prompt__button" onClick={() => void handleNotifications()} disabled={busy}>
					<Bell size={16} /> {busy ? "Please wait..." : pushSubscribed ? "Turn off notifications" : "Get notifications"}
				</button> : null}
			</div>
			{message ? <p className="app-prompt__message" role="status">{message}</p> : null}
		</aside>
	);
}
