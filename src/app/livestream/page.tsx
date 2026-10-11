import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Radio } from "lucide-react";
import { LivestreamPlayer } from "../../components/livestream-player";

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
          <p>Watch the RCCG Testimony House service live below on YouTube or Facebook.</p>
        </div>
        <LivestreamPlayer />
        <div className="livestream-page__actions livestream-page__actions--secondary">
          <Link className="text-arrow" href="/sermons">Browse sermons <ArrowUpRight size={16} /></Link>
          <Link className="text-arrow" href="/contact">Service information <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
