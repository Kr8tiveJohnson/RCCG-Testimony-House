"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const titles = ["Arch", "Ast. Pst", "Barr", "Dcn", "Dcns", "Dr", "Engr", "Evang", "Miss", "Mr", "Mrs", "Prof", "Pst", "Rev'd"];
const years = Array.from({ length: new Date().getFullYear() - 1994 + 1 }, (_, index) => String(1994 + index));
const qualifications = ["First School Leaving Cert", "SSCE", "NCE", "OND", "HND", "Bachelors", "Masters", "Doctorate", "Other"];
const programmes = [
  "Prayer Programmes", "Prayer School", "Praise Programmes", "Women's Programmes", "Men's Programmes",
  "Empowerment Programmes", "Career Development Programmes", "Business Development Programmes", "Evangelism Programmes",
  "Parenting Programmes", "Marriage Enrichment Programmes", "Leadership Development Programmes", "Book & Study Club",
  "Music & Entertainment", "Lifestyle & Community", "Missions & Field Mobilization", "Community Impact & Outreach Programmes",
  "Pastoral Training & Church Planting", "None of the above",
];
const smallGroups = [
  {
    name: "familyGroups",
    title: "Family & relationship groups",
    options: ["Single Parents", "Couples Fellowship (Less than 10 years)", "Couples Fellowship (above 10 years)", "Widows / Widowers", "Retirees & Seniors", "None of the above"],
  },
  {
    name: "wellnessGroups",
    title: "Health, wellness & lifestyle groups",
    options: ["Health & Fitness", "Mental Health & Wellness", "Football Group", "Foodies Group", "None of the above"],
  },
  {
    name: "communityGroups",
    title: "Community, service & social impact",
    options: ["Community Impact & Outreach", "Environmental Enthusiasts", "None of the above"],
  },
  {
    name: "careerGroups",
    title: "Career & business life groups",
    options: ["Construction & Real Estate", "Manufacturing & Industry", "Transportation & Logistics", "Technology & IT", "Hospitality & Tourism", "Telecommunication", "Creative & Media", "Arts & Entertainment", "Education", "Health", "Legal & Judiciary", "Oil, Gas & Power", "None of the above"],
  },
];

function CheckGroup({ name, title, options, required = false }: { name: string; title: string; options: string[]; required?: boolean }) {
  return (
    <fieldset className="membership-check-group" data-required-group={required ? "true" : undefined}>
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
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const requiredGroups = Array.from(form.querySelectorAll<HTMLElement>("[data-required-group='true']"));
    const missingGroup = requiredGroups.find((group) => !group.querySelector<HTMLInputElement>("input[type='checkbox']:checked"));
    if (missingGroup) {
      missingGroup.scrollIntoView({ behavior: "smooth", block: "center" });
      setStatus("Please select at least one option in each required interests section.");
      return;
    }

    const photo = form.elements.namedItem("photograph") as HTMLInputElement | null;
    if (photo?.files?.[0] && photo.files[0].size > 1024 * 1024) {
      setStatus("The photograph must be no larger than 1 MB.");
      photo.focus();
      return;
    }

    setStatus("This membership form is a design preview only. Your information and photo have not been sent or saved.");
  }

  return (
    <form className="registration-form membership-form" onSubmit={handleSubmit}>
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
        <label>Birth date <span>*</span><input name="birthDate" type="date" autoComplete="bday" required /></label>
        <label>Marital status <span>*</span><select name="maritalStatus" defaultValue="" required><option value="" disabled>Choose</option><option>Single</option><option>Married</option><option>Divorced</option><option>Separated</option><option>Widowed</option></select></label>
      </div>
      <label>Residential address <span>*</span><input name="address" type="text" autoComplete="street-address" required /></label>
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
      <CheckGroup name="programmes" title="Programmes of interest" options={programmes} required />
      {smallGroups.map((group) => <CheckGroup key={group.name} {...group} required />)}

      <div className="registration-form__section-title"><span>05</span><strong>Photograph &amp; consent</strong></div>
      <label className="membership-photo">Photograph <span className="registration-form__optional">OPTIONAL · IMAGE UP TO 1 MB</span><input name="photograph" type="file" accept="image/*" /></label>
      <label className="registration-form__consent"><input name="consent" type="checkbox" required /><span>I consent to RCCG Testimony House using the information I provide for church administration, programme planning, and follow-up. I understand it will be treated confidentially. <b>*</b></span></label>
      <button className="button button--coral registration-form__submit" type="submit">Submit membership form <ArrowRight size={16} /></button>
      {status ? <p className="registration-form__status" role="status"><CheckCircle2 size={18} /> {status}</p> : null}
    </form>
  );
}
