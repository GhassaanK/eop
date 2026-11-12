import "server-only";
import { isEmailAddress } from "@/lib/validation";

// Never return this configuration to a Client Component.
export function getJoinConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  const to = process.env.JOIN_FORM_TO_EMAIL?.trim();
  if (!host || !/^[a-z\d](?:[a-z\d.-]*[a-z\d])?$/i.test(host) || host.length > 253 || port !== 465 ||
      !user || !isEmailAddress(user) || !password?.trim() || !to || !isEmailAddress(to)) return null;
  return { host, port, user, password, to };
}
