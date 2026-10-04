import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Radio } from "lucide-react";

const livestreamUrl = "https://www.youtube.com/live/WwGdulhLa1w?si=39xplUR3w7h7DDJY";
const livestreamEmbedUrl = "https://www.youtube.com/embed/WwGdulhLa1w";

export const metadata: Metadata = {
  title: "Watch live",
  description: "Watch the RCCG Testimony House livestream online.",
};

export default function LivestreamPage() {
  return (
    <section className="livestream-page">
      <div className="livestream-page__inner page-width">
        <Link className="livestream-page__back" href="/"><ArrowLeft size={15} /> Back home</Link>
        <div className="livestream-page__heading">
          <p className="section-kicker"><Radio size={14} /> TESTIMONY HOUSE ONLINE</p>
          <h1>Join us<br /><em>live.</em></h1>
          <p>Watch the RCCG Testimony House service live below.</p>
        </div>
        <div className="livestream-player">
          <div className="livestream-player__screen">
            <iframe
              className="livestream-player__embed"
              src={livestreamEmbedUrl}
              title="RCCG Testimony House live stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div className="livestream-player__status"><span /> LIVE NOW</div>
          </div>
          <div className="livestream-player__footer"><span>LIVE STREAM</span><span>Streaming from RCCG Testimony House</span></div>
        </div>
        <div className="livestream-page__actions">
          <a className="pill-button pill-button--purple" href={livestreamUrl} target="_blank" rel="noreferrer">Watch on YouTube <span><ArrowUpRight size={17} /></span></a>
          <Link className="text-arrow" href="/sermons">Browse sermons <ArrowUpRight size={16} /></Link>
          <Link className="text-arrow" href="/contact">Service information <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
