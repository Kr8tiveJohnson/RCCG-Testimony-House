import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ComingSoon({ eyebrow, title, description }: ComingSoonProps) {
  return (
    <section className="coming-soon page-width">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="coming-soon__description">{description}</p>
      <Link className="button button--dark" href="/">
        <ArrowLeft size={16} /> Back to home
      </Link>
    </section>
  );
}
