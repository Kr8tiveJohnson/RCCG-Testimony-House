"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
	{ label: "Home", href: "/" },
	{ label: "About us", href: "/about" },
	{ label: "Ministries", href: "/ministries" },
	{ label: "Sermons", href: "/sermons" },
	{ label: "Watch live", href: "/livestream" },
	{ label: "Events", href: "/events" },
	{ label: "Testimonies", href: "/testimonies" },
	{ label: "Request prayer", href: "/prayer-request" },
	{ label: "Membership form", href: "/register" },
	{ label: "Contact us", href: "/contact" },
];

export function SiteHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		if (!isMenuOpen) return;
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsMenuOpen(false);
		};
		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [isMenuOpen]);

	return (
		<header className={`site-header${isMenuOpen ? " site-header--open" : ""}`}>
			<div className="site-header__inner page-width">
				<Link className="brand" href="/" aria-label="RCCG Testimony House home" onClick={() => setIsMenuOpen(false)}>
					<Image src="/images/logo/TESTIMONY%20LOGO.png" alt="RCCG Testimony House Youth" width={180} height={82} priority className="brand__logo" />
				</Link>

				<nav className="site-nav" aria-label="Main navigation">
					{navigation.map((item) => (
						<Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
							{item.label}
						</Link>
					))}
				</nav>

				<button
					type="button"
					className="menu-toggle"
					aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
					aria-expanded={isMenuOpen}
					aria-controls="primary-navigation"
					onClick={() => setIsMenuOpen((open) => !open)}
				>
					{isMenuOpen ? <X size={24} /> : <span className="menu-toggle__lines"><i /><i /><i /></span>}
				</button>
			</div>

			<nav id="primary-navigation" className={`menu-overlay${isMenuOpen ? " menu-overlay--open" : ""}`} aria-label="Main navigation" aria-hidden={!isMenuOpen}>
				<div className="menu-overlay__inner page-width">
					<div className="menu-overlay__top"><span>RCCG TESTIMONY HOUSE</span><span>FAITH · FAMILY · PURPOSE</span></div>
					<div className="menu-overlay__links">
						{navigation.map((item, index) => (
							<Link key={item.href} href={item.href} tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
								<span>0{index + 1}</span>{item.label}<ArrowUpRight size={21} />
							</Link>
						))}
					</div>
					<div className="menu-overlay__bottom"><span>WE’RE GLAD YOU’RE HERE.</span><Link href="/give" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>Give with purpose <ArrowUpRight size={16} /></Link></div>
				</div>
			</nav>
		</header>
	);
}
