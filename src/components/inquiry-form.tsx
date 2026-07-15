"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { submitInquiry, type InquiryActionState } from "@/app/actions/contact";

const initialState: InquiryActionState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button button--primary" disabled={pending} type="submit">
      {pending ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}
      {pending ? "Sending inquiry" : "Send inquiry"}
    </button>
  );
}

export function InquiryForm() {
  const [state, formAction] = useActionState(submitInquiry, initialState);
  const errors = state.fields ?? {};

  return (
    <form action={formAction} className="inquiry-form" noValidate>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input autoComplete="off" id="website" name="website" tabIndex={-1} type="text" />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input aria-describedby={errors.name ? "name-error" : undefined} aria-invalid={Boolean(errors.name)} id="name" name="name" required />
          {errors.name && <p className="field-error" id="name-error">{errors.name[0]}</p>}
        </div>
        <div className="field">
          <label htmlFor="businessName">Business name <span>Optional</span></label>
          <input id="businessName" name="businessName" />
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input aria-describedby={errors.email ? "email-error" : undefined} aria-invalid={Boolean(errors.email)} autoComplete="email" id="email" name="email" required type="email" />
          {errors.email && <p className="field-error" id="email-error">{errors.email[0]}</p>}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number <span>Optional</span></label>
          <input autoComplete="tel" id="phone" name="phone" type="tel" />
        </div>
        <div className="field">
          <label htmlFor="projectType">What do you need?</label>
          <select id="projectType" name="projectType" defaultValue="">
            <option value="">Choose an option</option>
            <option>New website</option>
            <option>Website rebuild</option>
            <option>Ongoing website care</option>
            <option>Not sure yet</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">Indicative budget <span>Optional</span></label>
          <select id="budget" name="budget" defaultValue="">
            <option value="">Choose an option</option>
            <option>Still deciding</option>
            <option>Under R20 000</option>
            <option>R20 000 to R50 000</option>
            <option>R50 000 to R100 000</option>
            <option>R100 000+</option>
          </select>
        </div>
        <div className="field field--full">
          <label htmlFor="message">Tell us what needs to change</label>
          <textarea aria-describedby={errors.message ? "message-error" : undefined} aria-invalid={Boolean(errors.message)} id="message" name="message" required rows={7} />
          {errors.message && <p className="field-error" id="message-error">{errors.message[0]}</p>}
        </div>
      </div>
      <div className="form-footer">
        <p>Your details are used to respond to this inquiry. Read the <a href="/privacy">privacy notice</a>.</p>
        <SubmitButton />
      </div>
      {state.status !== "idle" && (
        <p className={state.status === "success" ? "form-message form-message--success" : "form-message form-message--error"} aria-live="polite">
          {state.message}
        </p>
      )}
    </form>
  );
}