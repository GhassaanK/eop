// Imported by Server Components and the Route Handler only. Never return this object to a client.
export function getJoinConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.JOIN_FORM_TO_EMAIL?.trim();
  const from = process.env.JOIN_FORM_FROM_EMAIL?.trim();
  return apiKey && to && from ? { apiKey, to, from } : null;
}
