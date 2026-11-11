export const participationTypes = [
  "Individual student", "Student organization", "Student union", "Campus campaign", "Academic or civil society collaborator", "Other",
] as const;

export type JoinData = {
  fullName: string; email: string; country: string; organization: string;
  participationType: string; message: string; privacy: boolean; website: string;
};
export type JoinErrors = Partial<Record<keyof JoinData, string>>;
export const limits = { fullName: 100, email: 254, country: 100, organization: 180, participationType: 80, message: 2000, website: 200 };

export function validateJoin(input: unknown): { ok: true; data: JoinData } | { ok: false; errors: JoinErrors } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, errors: { fullName: "Please complete the form." } };
  const record = input as Record<string, unknown>;
  const errors: JoinErrors = {};
  const data: JoinData = { fullName: "", email: "", country: "", organization: "", participationType: "", message: "", privacy: record.privacy === true, website: "" };
  for (const field of Object.keys(limits) as (keyof typeof limits)[]) {
    const value = record[field];
    if (typeof value !== "string") {
      if (value !== undefined || !["organization", "message", "website"].includes(field)) errors[field] = "Enter a valid value.";
      continue;
    }
    data[field] = value.trim();
    if (value.length > limits[field]) errors[field] = `Use ${limits[field]} characters or fewer.`;
    // Keep multiline text only in the message; reject invisible control characters elsewhere.
    if (field !== "message" && /[\u0000-\u001f\u007f]/.test(value)) errors[field] = "Remove line breaks or control characters.";
    if (field === "message" && /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) errors[field] = "Remove unsupported control characters.";
  }
  if (!data.fullName) errors.fullName = "Enter your full name.";
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) errors.email = "Enter a valid email address.";
  if (!data.country) errors.country = "Enter your country.";
  if (!(participationTypes as readonly string[]).includes(data.participationType)) errors.participationType = "Select a participation type.";
  if (!data.privacy) errors.privacy = "Please acknowledge how your information will be used.";
  if (data.website) errors.website = "Unable to accept this submission.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
