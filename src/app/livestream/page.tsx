import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Radio, VideoOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Watch live",
  description: "Watch RCCG Testimony House services online. Livestream details will be announced when the stream is available.",
};

export default function LivestreamPage() {
  return (
    <section className="livestream-page">
      <div className="livestream-page__inner page-width">
        <Link className="livestream-page__back" href="/"><ArrowLeft size={15} /> Back home</Link>
        <div className="livestream-page__heading">
          <p className="section-kicker"><Radio size={14} /> TESTIMONY HOUSE ONLINE</p>
          <h1>Our livestream is<br /><em>under construction.</em></h1>
          <p>We’re preparing this space for future live services. Please check back in a later update.</p>
        </div>
        <div className="livestream-player" aria-label="Livestream page under construction">
          <div className="livestream-player__screen">
            <div className="livestream-player__status"><span /> COMING SOON</div>
            <div className="livestream-player__message">
              <VideoOff size={28} />
              <h2>Livestream under construction</h2>
              <p>We’ll share more details when the livestream feature is ready.</p>
            </div>
            <span className="livestream-player__watermark">RCCG TESTIMONY HOUSE</span>
          </div>
          <div className="livestream-player__footer"><span>COMING SOON</span><span>Livestream feature planned for a future phase.</span></div>
        </div>
        <div className="livestream-page__actions">
          <Link className="pill-button pill-button--purple" href="/sermons">Browse sermons <span><ArrowUpRight size={17} /></span></Link>
          <Link className="text-arrow" href="/contact">Service information <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
