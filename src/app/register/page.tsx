import type { Metadata } from "next";
import { MemberRegistrationForm } from "../../components/member-registration-form";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Membership form",
  description: "Complete the RCCG Testimony House membership form to share your details and connect with the church family in Lagos.",
};

export default function RegisterPage() {
  return (
    <section className="registration-page">
      <div className="registration-page__inner page-width">
        <div className="registration-intro">
          <Link href="/" className="registration-back"><ArrowLeft size={15} /> Back home</Link>
          <p className="eyebrow">YOUR NEXT STEP AT TESTIMONY HOUSE</p>
          <h1>Membership biodata <em>form</em></h1>
          <p className="registration-intro__description">
            We’re glad you’re here. Share a few details so our church family can welcome you, help you connect, and discover how you’d like to grow and serve.
          </p>
          <div className="registration-trust"><ShieldCheck size={16} /><span>Your information is handled with care and used for church connection and planning.</span></div>
        </div>

        <div className="registration-form-panel">
          <div className="registration-form-panel__heading">
            <div><span>MEMBERSHIP REGISTRATION</span><h2>Let’s get to know you.</h2></div>
            <p><b>*</b> Required</p>
          </div>
          <MemberRegistrationForm />
          <p className="registration-privacy"><ShieldCheck size={15} /> This is a front-end preview. Submissions are not sent or stored yet. <Link href="/privacy-policy">Privacy policy</Link></p>
          <Link className="registration-help" href="/contact">Need help? Contact the church <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
