import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Contact RCCG Testimony House in Lagos by email or phone, and follow the church on social media.",
};

export default function ContactPage() {
  return (
    <section className="contact-page">
      <div className="contact-page__inner page-width">
        <Link href="/" className="contact-page__back"><ArrowLeft size={15} /> Back home</Link>
        <header className="contact-page__intro">
          <p className="section-kicker">SAY HELLO</p>
          <h1>We’d love to<br /><em>hear from you.</em></h1>
          <p>Reach out to RCCG Testimony House or follow along with our latest messages and updates.</p>
        </header>
        <div className="contact-page__grid">
          <a className="contact-card" href="mailto:rccglp103@gmail.com">
            <span className="contact-card__icon"><Mail size={21} /></span>
            <span className="contact-card__label">EMAIL US</span>
            <strong>rccglp103@gmail.com</strong>
            <span className="contact-card__action">Send an email <ArrowUpRight size={15} /></span>
          </a>
          <a className="contact-card" href="tel:+2347067156156">
            <span className="contact-card__icon"><Phone size={21} /></span>
            <span className="contact-card__label">CALL OR WHATSAPP</span>
            <strong>0706 715 6156</strong>
            <span className="contact-card__action">Call the church <ArrowUpRight size={15} /></span>
          </a>
        </div>
        <div className="contact-socials">
          <div><p className="section-kicker">FOLLOW THE CHURCH</p><h2>Stay connected.</h2></div>
          <div className="contact-socials__links">
            <a href="https://web.facebook.com/profile.php?id=61552666253336" target="_blank" rel="noreferrer"><FaFacebookF /> Facebook <ArrowUpRight size={15} /></a>
            <a href="https://www.youtube.com/@testimonyhouselp103" target="_blank" rel="noreferrer"><FaYoutube /> YouTube <ArrowUpRight size={15} /></a>
            <a href="https://www.tiktok.com/@rccgtestimonyhouselp103" target="_blank" rel="noreferrer"><FaTiktok /> TikTok <ArrowUpRight size={15} /></a>
          </div>
          <p className="contact-socials__handle">TikTok: @rccgtestimonyhouselp103</p>
        </div>
      </div>
    </section>
  );
}
