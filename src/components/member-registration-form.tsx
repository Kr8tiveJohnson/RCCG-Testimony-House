"use client";

import { ArrowRight, CheckCircle2, CircleAlert, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { googleAppsScriptUrl } from "../lib/google-sheets";

const titles = ["Arch", "Ast. Pst", "Barr", "Dcn", "Dcns", "Dr", "Engr", "Evang", "Miss", "Mr", "Mrs", "Prof", "Pst", "Rev'd"];
const years = Array.from({ length: new Date().getFullYear() - 1994 + 1 }, (_, index) => String(1994 + index));
const birthMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const birthDays = Array.from({ length: 31 }, (_, index) => String(index + 1));
const qualifications = ["First School Leaving Cert", "SSCE", "NCE", "OND", "HND", "Bachelors", "Masters", "Doctorate", "Other"];
const programmes = [
  "Prayer Programmes", "Prayer School", "Praise Programmes", "Women's Programmes", "Men's Programmes",
  "Empowerment Programmes", "Career Development Programmes", "Business Development Programmes", "Evangelism Programmes",
  "Parenting Programmes", "Marriage Enrichment Programmes", "Leadership Development Programmes", "Book & Study Club",
  "Music & Entertainment", "Lifestyle & Community", "Missions & Field Mobilization", "Community Impact & Outreach Programmes",
  "Pastoral Training & Church Planting", "None of the above",
];
const familyGroups = [
  {
    name: "familyGroups",
    title: "Family & relationship groups",
    options: ["Single Parents", "Couples Fellowship (Less than 10 years)", "Couples Fellowship (above 10 years)", "Widows / Widowers", "Retirees & Seniors", "None of the above"],
  },
];

function CheckGroup({ name, title, options, required = false, invalid = false }: { name: string; title: string; options: string[]; required?: boolean; invalid?: boolean }) {
  return (
    <fieldset className="membership-check-group" data-required-group={required ? name : undefined} data-invalid={invalid || undefined} aria-invalid={invalid}>
      <legend>{title}{required ? <span> *</span> : null}<small>{required ? "Select all that apply" : "Optional · Select all that apply"}</small></legend>
      <div className="membership-check-group__options">
        {options.map((option) => (
          <label className="membership-check" key={option}>
            <input type="checkbox" name={name} value={option} />
            <span>{option}</span>
          </label>
        ))}
        <label className="membership-check membership-check--other">
          <input type="checkbox" name={name} value="Other" />
          <span>Other</span>
          <input className="membership-check__other-text" type="text" name={`${name}Other`} aria-label={`Other ${title}`} placeholder="Please specify" />
        </label>
      </div>
    </fieldset>
  );
}

export function MemberRegistrationForm() {
  const [status, setStatus] = useState<{ type: "error" | "info"; message: string } | null>(null);
  const [invalidGroup, setInvalidGroup] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const requiredGroups = Array.from(form.querySelectorAll<HTMLElement>("[data-required-group]"));
    const missingGroup = requiredGroups.find((group) => !group.querySelector<HTMLInputElement>("input[type='checkbox']:checked"));
    if (missingGroup) {
      setInvalidGroup(missingGroup.dataset.requiredGroup ?? null);
      missingGroup.scrollIntoView({ behavior: "smooth", block: "center" });
      setStatus({ type: "error", message: "Please select at least one option in each required interests section." });
      return;
    }

    setInvalidGroup(null);
    const photo = form.elements.namedItem("photograph") as HTMLInputElement | null;
    if (photo?.files?.[0] && photo.files[0].size > 1024 * 1024) {
      setStatus({ type: "error", message: "The photograph must be no larger than 1 MB." });
      photo.focus();
      return;
    }

    if (googleAppsScriptUrl) {
      const formData = new FormData(form);
      formData.delete("photograph");
      const submissionData = new URLSearchParams();
      formData.forEach((value, key) => {
        if (typeof value === "string") submissionData.append(key, value);
      });

      try {
        setStatus({ type: "info", message: "Submitting your details to the church database..." });

        const response = await fetch(googleAppsScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: submissionData.toString(),
        });

        const resultText = await response.text();
        let result: { success?: boolean; error?: string } = {};

        try {
          result = JSON.parse(resultText);
        } catch {
          result = {};
        }

        if (!response.ok || result.success === false) {
          throw new Error(result.error || "Submission failed.");
        }

        setStatus({ type: "info", message: "Your membership details have been submitted successfully. The church team will review them soon." });
        setShowSuccessModal(true);
        form.reset();
        return;
      } catch (error) {
        console.error(error);
        setStatus({ type: "error", message: "We could not save your details to the Google Sheet. Please try again or contact the church." });
        return;
      }
    }

    setStatus({ type: "info", message: "This membership form is a preview only. Your information and photo have not been sent or saved." });
  }

  return (
    <form className="registration-form membership-form" onSubmit={handleSubmit} onChange={() => { if (status?.type === "error") { setStatus(null); setInvalidGroup(null); } }}>
      <div className="registration-form__section-title"><span>01</span><strong>Church connection</strong></div>
      <div className="registration-form__row">
        <label>Which category best describes you? <span>*</span>
          <select name="category" defaultValue="" required>
            <option value="" disabled>Choose a category</option>
            <option>Church member</option><option>Church worker / minister</option><option>Member of another RCCG parish</option><option>Teen church member</option><option>Visitor</option>
          </select>
        </label>
        <label>What year did you join / start attending? <span>*</span>
          <select name="yearJoined" defaultValue="" required><option value="" disabled>Choose a year</option>{years.map((year) => <option key={year}>{year}</option>)}<option>Not applicable - first visit</option></select>
        </label>
      </div>

      <div className="registration-form__section-title"><span>02</span><strong>Personal details</strong></div>
      <div className="registration-form__row registration-form__row--three">
        <label>Title <span>*</span><select name="title" defaultValue="" required><option value="" disabled>Choose</option>{titles.map((title) => <option key={title}>{title}</option>)}</select></label>
        <label>Surname <span>*</span><input name="surname" type="text" autoComplete="family-name" required /></label>
        <label>First name <span>*</span><input name="firstName" type="text" autoComplete="given-name" required /></label>
      </div>
      <div className="registration-form__row">
        <label>Other names <span className="registration-form__optional">OPTIONAL</span><input name="otherNames" type="text" autoComplete="additional-name" /></label>
        <label>Gender <span>*</span><select name="gender" defaultValue="" required><option value="" disabled>Choose</option><option>Male</option><option>Female</option></select></label>
      </div>
      <div className="registration-form__row">
        <label>Birth month <span>*</span><select name="birthMonth" defaultValue="" required><option value="" disabled>Month</option>{birthMonths.map((month) => <option key={month}>{month}</option>)}</select></label>
        <label>Birth day <span>*</span><select name="birthDay" defaultValue="" required><option value="" disabled>Day</option>{birthDays.map((day) => <option key={day}>{day}</option>)}</select></label>
        <label>Marital status <span>*</span><select name="maritalStatus" defaultValue="" required><option value="" disabled>Choose</option><option>Single</option><option>Married</option><option>Divorced</option><option>Separated</option><option>Widowed</option></select></label>
      </div>
      <label>Residential address <span>*</span><input name="address" type="text" autoComplete="street-address" required /></label>
      <label>Nearest bus stop <span>*</span><input name="nearestBustop" type="text" required /></label>
      <div className="registration-form__row">
        <label>Email address <span className="registration-form__optional">OPTIONAL</span><input name="email" type="email" autoComplete="email" /></label>
        <label>Telephone / WhatsApp number <span>*</span><input name="phone" type="tel" autoComplete="tel" required /></label>
      </div>
      <div className="registration-form__row">
        <label>Nationality <span>*</span><input name="nationality" type="text" autoComplete="country-name" required /></label>
        <label>Highest educational qualification <span>*</span><select name="qualification" defaultValue="" required><option value="" disabled>Choose</option>{qualifications.map((qualification) => <option key={qualification}>{qualification}</option>)}</select></label>
      </div>
      <label>Profession / occupation <span>*</span><input name="occupation" type="text" required /></label>
      <label>Additional expertise or skills you’re willing to volunteer <span>*</span><textarea name="volunteerSkills" rows={3} required /></label>

      <div className="registration-form__section-title"><span>03</span><strong>Family details</strong><span className="registration-form__optional">OPTIONAL</span></div>
      <div className="registration-form__row">
        <label>Is your spouse a member of Testimony House?<select name="spouseMember" defaultValue=""><option value="">Choose</option><option>Yes</option><option>No</option><option>Not applicable</option></select></label>
        <label>Spouse name<input name="spouseName" type="text" /></label>
      </div>
      <label>Wedding anniversary date<input name="anniversary" type="date" /></label>

      <div className="registration-form__section-title"><span>04</span><strong>Programmes &amp; groups</strong></div>
      <CheckGroup name="programmes" title="Programmes of interest" options={programmes} required invalid={invalidGroup === "programmes"} />
      {familyGroups.map((group) => <CheckGroup key={group.name} {...group} required invalid={invalidGroup === group.name} />)}

      <div className="registration-form__section-title"><span>05</span><strong>Photograph &amp; consent</strong></div>
      <label className="membership-photo">Photograph <span className="registration-form__optional">OPTIONAL · IMAGE UP TO 1 MB</span><input name="photograph" type="file" accept="image/*" /></label>
      <label className="registration-form__consent"><input name="consent" type="checkbox" required /><span>I consent to RCCG Testimony House using the information I provide for church administration, programme planning, and follow-up. I understand it will be treated confidentially. <b>*</b></span></label>
      <button className="button button--coral registration-form__submit" type="submit">Submit membership form <ArrowRight size={16} /></button>
      {status ? <p className={`registration-form__status registration-form__status--${status.type}`} role={status.type === "error" ? "alert" : "status"}>{status.type === "error" ? <CircleAlert size={18} /> : <CheckCircle2 size={18} />} {status.message}</p> : null}

      {showSuccessModal ? (
        <div className="registration-success-modal" role="dialog" aria-modal="true" aria-labelledby="membership-success-title">
          <div className="registration-success-modal__backdrop" onClick={() => setShowSuccessModal(false)} />
          <div className="registration-success-modal__card">
            <button type="button" className="registration-success-modal__close" aria-label="Close success message" onClick={() => setShowSuccessModal(false)}>
              <X size={16} />
            </button>
            <div className="registration-success-modal__icon"><CheckCircle2 size={34} /></div>
            <h3 id="membership-success-title">Successfully submitted</h3>
            <p>Your membership form has been received. The church team will review it soon.</p>
            <button type="button" className="button button--dark registration-success-modal__button" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
