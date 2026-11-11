"use client";

import { useRef, useState, type FormEvent } from "react";
import { Arrow } from "@/components/ui";
import { limits, participationTypes, validateJoin, type JoinData, type JoinErrors } from "@/lib/validation";

export default function JoinForm({ available }: { available: boolean }) {
  const [errors, setErrors] = useState<JoinErrors>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);

  function showStatus(message: string, error: boolean) {
    setStatus({ message, error });
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const data: JoinData = {
      fullName: String(fields.get("fullName") ?? ""), email: String(fields.get("email") ?? ""), country: String(fields.get("country") ?? ""),
      organization: String(fields.get("organization") ?? ""), participationType: String(fields.get("participationType") ?? ""),
      message: String(fields.get("message") ?? ""), privacy: fields.get("privacy") === "on", website: String(fields.get("website") ?? ""),
    };
    setStatus(null);
    const checked = validateJoin(data);
    if (!checked.ok) {
      setErrors(checked.errors);
      const first = Object.keys(checked.errors)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    submitting.current = true;
    setPending(true);
    try {
      const res = await fetch("/api/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(checked.data), signal: AbortSignal.timeout(20_000) });
      const payload = await res.json() as { success?: boolean; message?: string; error?: string; errors?: JoinErrors };
      if (!res.ok || payload.success !== true) {
        setErrors(payload.errors ?? {});
        showStatus(payload.error ?? "Your submission could not be confirmed. Please try again later.", true);
      } else {
        form.reset();
        showStatus(payload.message ?? "Your expression of interest has been submitted. This does not confirm membership.", false);
      }
    } catch { showStatus("Your submission could not be confirmed. Please check your connection and try again later.", true); }
    finally { submitting.current = false; setPending(false); }
  }

  function errorFor(field: keyof JoinData) {
    return errors[field] ? <p className="field-error" id={`${field}-error`}>{errors[field]}</p> : null;
  }
  const fieldProps = (field: keyof JoinData) => ({ "aria-invalid": errors[field] ? true as const : undefined, "aria-describedby": errors[field] ? `${field}-error` : undefined });

  return <div className="form-panel"><h2>Express your interest</h2><p>Required fields are marked with an asterisk (*).</p>
    {!available && <div className="form-notice" role="status">The form is temporarily unavailable. You can visit the official conference Facebook page, linked alongside this form, for an alternative point of contact.</div>}
    <form onSubmit={submit} noValidate aria-busy={pending}>
      <div className="form-grid">
        <div className="field"><label htmlFor="fullName">Full name *</label><input id="fullName" name="fullName" autoComplete="name" maxLength={limits.fullName} required {...fieldProps("fullName")} />{errorFor("fullName")}</div>
        <div className="field"><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" autoComplete="email" maxLength={limits.email} required {...fieldProps("email")} />{errorFor("email")}</div>
        <div className="field"><label htmlFor="country">Country *</label><input id="country" name="country" autoComplete="country-name" maxLength={limits.country} required {...fieldProps("country")} />{errorFor("country")}</div>
        <div className="field"><label htmlFor="organization">University or organization <span className="optional">(optional)</span></label><input id="organization" name="organization" autoComplete="organization" maxLength={limits.organization} {...fieldProps("organization")} />{errorFor("organization")}</div>
        <div className="field field-full"><label htmlFor="participationType">Participation type *</label><select id="participationType" name="participationType" defaultValue="" required {...fieldProps("participationType")}><option value="" disabled>Select how you would like to participate</option>{participationTypes.map((type) => <option key={type}>{type}</option>)}</select>{errorFor("participationType")}</div>
        <div className="field field-full"><label htmlFor="message">Message <span className="optional">(optional)</span></label><textarea id="message" name="message" rows={5} maxLength={limits.message} {...fieldProps("message")} />{errorFor("message")}</div>
      </div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" autoComplete="off" tabIndex={-1} maxLength={limits.website} /></div>
      <label className="privacy-check"><input name="privacy" type="checkbox" required {...fieldProps("privacy")} /><span>I acknowledge that the information I provide will be sent to the initiative’s designated recipient through its email provider, Resend, to consider my expression of interest. Submission does not confirm membership. *</span></label>{errorFor("privacy")}
      <button className="button" type="submit" disabled={pending}>{pending ? "Submitting…" : "Submit expression of interest"}<Arrow /></button>
      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true" className={status ? `form-status${status.error ? " error" : ""}` : undefined}>{status?.message}</div>
      <noscript><p className="form-notice">Please enable JavaScript to submit this form, or visit the official conference Facebook page.</p></noscript>
    </form>
    <div className="form-expectations"><h3>What submitting means</h3><p>This is an expression of interest in a proposed movement. It does not guarantee membership, approval, or an official response. Please share only what is needed to introduce your interest, and avoid sensitive personal information in your message.</p></div>
  </div>;
}
