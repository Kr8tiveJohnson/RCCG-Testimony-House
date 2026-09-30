import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";

const footerLinks = [
	{ label: "About", href: "/about" },
	{ label: "Ministries", href: "/ministries" },
	{ label: "Sermons", href: "/sermons" },
	{ label: "Events", href: "/events" },
	{ label: "Membership form", href: "/register" },
	{ label: "Prayer request", href: "/prayer-request" },
	{ label: "Contact", href: "/contact" },
];

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="site-footer__invite page-width">
				<div><span>YOUR STORY HAS A PLACE HERE</span><h2>We’d love to welcome you.</h2></div>
				<Link className="site-footer__invite-button" href="/register">Membership form <ArrowRight size={17} /></Link>
			</div>
			<div className="site-footer__main page-width">
				<div className="site-footer__brand-block">
					<Link href="/" aria-label="RCCG Testimony House home">
						<Image
							src="/images/logo/TESTIMONY%20LOGO.png"
							alt="RCCG Testimony House Youth"
							width={175}
							height={80}
							className="site-footer__logo"
						/>
					</Link>
					<p>A welcoming church family growing in faith, hope, and purpose.</p>
					<span className="site-footer__motto">FAITH <i /> FAMILY <i /> PURPOSE</span>
				</div>

				<div className="site-footer__links-block">
					<p className="footer-label">Explore</p>
					<nav className="site-footer__links" aria-label="Footer navigation">
						{footerLinks.map((item) => (
							<Link key={item.href} href={item.href}>{item.label}<ArrowUpRight size={13} /></Link>
						))}
					</nav>
				</div>

				<div className="site-footer__connect">
					<p className="footer-label">Get in touch</p>
					<div className="site-footer__contact-links">
						<a href="mailto:rccglp103@gmail.com"><span><Mail size={16} /></span><div><small>EMAIL</small>rccglp103@gmail.com</div><ArrowUpRight size={14} /></a>
						<a href="tel:+2347067156156"><span><Phone size={16} /></span><div><small>CALL OR WHATSAPP</small>0706 715 6156</div><ArrowUpRight size={14} /></a>
					</div>
					<div className="site-footer__socials">
						<span>FOLLOW ALONG</span>
						<a href="https://web.facebook.com/profile.php?id=61552666253336" target="_blank" rel="noreferrer" aria-label="RCCG Testimony House on Facebook"><FaFacebookF /> Facebook <ArrowUpRight size={13} /></a>
						<a href="https://www.youtube.com/@testimonyhouselp103" target="_blank" rel="noreferrer" aria-label="RCCG Testimony House on YouTube"><FaYoutube /> YouTube <ArrowUpRight size={13} /></a>
						<a href="https://www.tiktok.com/@rccgtestimonyhouselp103" target="_blank" rel="noreferrer" aria-label="RCCG Testimony House on TikTok"><FaTiktok /> TikTok <ArrowUpRight size={13} /></a>
					</div>
				</div>
			</div>
			<div className="site-footer__bottom page-width">
				<span>© {new Date().getFullYear()} RCCG Testimony House</span>
				<span>Rooted in faith. Growing in purpose.</span>
			</div>
		</footer>
	);
}
