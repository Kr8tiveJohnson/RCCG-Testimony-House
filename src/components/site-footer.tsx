import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="site-footer__main page-width">
				<div className="site-footer__connect">
					<p className="footer-label">Get in touch</p>
					<div className="site-footer__contact-links">
						<a href="mailto:rccglp103@gmail.com"><span><Mail size={16} /></span><div><small>EMAIL</small><strong>rccglp103@gmail.com</strong></div><ArrowUpRight size={14} /></a>
						<a href="tel:+2347067156156"><span><Phone size={16} /></span><div><small>CALL OR WHATSAPP</small><strong>0706 715 6156</strong></div><ArrowUpRight size={14} /></a>
					</div>
				</div>

				<div className="site-footer__socials">
					<p className="footer-label">Follow us</p>
					<div className="site-footer__social-icons">
						<a href="https://web.facebook.com/profile.php?id=61552666253336" target="_blank" rel="noreferrer" aria-label="RCCG Testimony House on Facebook" title="Facebook"><FaFacebookF /></a>
						<a href="https://www.youtube.com/@testimonyhouselp103" target="_blank" rel="noreferrer" aria-label="RCCG Testimony House on YouTube" title="YouTube"><FaYoutube /></a>
						<a href="https://www.tiktok.com/@rccgtestimonyhouselp103" target="_blank" rel="noreferrer" aria-label="RCCG Testimony House on TikTok" title="TikTok"><FaTiktok /></a>
					</div>
				</div>
			</div>
			<div className="site-footer__bottom page-width">
				<span>© {new Date().getFullYear()} RCCG Testimony House</span>
			</div>
		</footer>
	);
}
