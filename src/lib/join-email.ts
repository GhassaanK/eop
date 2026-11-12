import "server-only";
import nodemailer from "nodemailer";
import { getJoinConfig } from "@/lib/join-config";
import type { JoinData } from "@/lib/validation";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export async function sendJoinEmail(data: JoinData, config: NonNullable<ReturnType<typeof getJoinConfig>>) {
  const timestamp = new Date().toISOString();
  const fields = [
    ["Full Name", data.fullName], ["Email Address", data.email], ["Country", data.country],
    ["University / Organization", data.organization || "Not provided"],
    ["Participation Type", data.participationType], ["Message", data.message || "Not provided"],
    ["Submission Timestamp (UTC)", timestamp], ["Privacy acknowledgement", "Accepted"],
  ];
  const text = ["New Join Us Submission | Echo of Palestine", "", ...fields.map(([label, value]) => `${label}: ${value}`), "", "This is an expression of interest, not confirmed membership."].join("\n");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body style="margin:0;padding:24px;background:#F8F8F5;color:#424742;font-family:Arial,sans-serif"><table role="presentation" style="width:100%;max-width:640px;margin:auto;border-collapse:collapse;background:#FFFFFF"><tr><td style="padding:28px;border-top:4px solid #09573D"><h1 style="margin:0 0 24px;color:#09573D;font-size:24px">New Join Us Submission</h1><table style="width:100%;border-collapse:collapse">${fields.map(([label, value]) => `<tr><th scope="row" style="padding:12px 12px 12px 0;text-align:left;vertical-align:top;border-bottom:1px solid #E3E6E1;font-size:13px;width:36%">${escapeHtml(label)}</th><td style="padding:12px 0;vertical-align:top;border-bottom:1px solid #E3E6E1;font-size:14px;line-height:1.6;overflow-wrap:anywhere;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")}</table><p style="font-size:12px;line-height:1.7;margin-top:24px">This is an expression of interest, not confirmed membership. Reply to this email to contact the applicant.</p></td></tr></table></body></html>`;

  const transporter = nodemailer.createTransport({
    host: config.host, port: config.port, secure: true,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 10_000, greetingTimeout: 8_000, socketTimeout: 10_000, dnsTimeout: 5_000,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      transporter.sendMail({
        from: { name: "Echo of Palestine", address: config.user },
        to: { address: config.to, name: "Echo of Palestine" },
        replyTo: { address: data.email, name: data.fullName },
        subject: `New Join Us Submission | ${data.fullName}`,
        text, html, date: new Date(timestamp),
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => { transporter.close(); reject(new Error("SMTP request timed out")); }, 20_000);
      }),
    ]);
    // sendMail can resolve with some rejected recipients. Require the intended mailbox.
    const accepted = result.accepted?.some((entry) => entry.toLowerCase() === config.to.toLowerCase());
    if (!accepted || result.rejected?.length) throw new Error("SMTP recipient was not accepted");
  } finally {
    if (timer) clearTimeout(timer);
    transporter.close();
  }
}
