import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ComingSoon({ eyebrow, title, description }: ComingSoonProps) {
  return (
    <section className="coming-soon page-width">
      <div className="coming-soon__icon" aria-hidden="true">
        <Sparkles size={22} />
      </div>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="coming-soon__description">{description}</p>
      <Link className="button button--dark" href="/">
        <ArrowLeft size={16} /> Back to home
      </Link>
    </section>
  );
}
