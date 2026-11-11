import { createHash } from "node:crypto";
import { validateJoin } from "@/lib/validation";
import { getJoinConfig } from "@/lib/join-config";

export const runtime = "nodejs";
const MAX_BYTES = 16_384;
const response = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return response({ error: "Please submit the form from this website." }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return response({ error: "This form requires a JSON submission." }, 415);
  if (Number(request.headers.get("content-length")) > MAX_BYTES) return response({ error: "Your submission is too large." }, 413);

  let input: unknown;
  try {
    if (!request.body) return response({ error: "Please complete the form." }, 400);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > MAX_BYTES) {
          await reader.cancel();
          return response({ error: "Your submission is too large." }, 413);
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return response({ error: "We could not read this submission. Please try again." }, 400); }

  const result = validateJoin(input);
  if (!result.ok) return response({ error: "Please check the form and try again.", errors: result.errors }, 400);
  const config = getJoinConfig();
  if (!config) return response({ error: "The expression of interest form is temporarily unavailable. Please visit the official conference Facebook page for an alternative point of contact." }, 503);

  const { data } = result;
  const text = [
    "Expression of interest: International Student Solidarity Movement for Palestine",
    `Full name: ${data.fullName}`, `Email: ${data.email}`, `Country: ${data.country}`,
    `University or organization: ${data.organization || "Not provided"}`,
    `Participation type: ${data.participationType}`, "", "Message:", data.message || "Not provided", "",
    "Privacy acknowledgement: accepted. Submission is an expression of interest, not confirmed membership.",
  ].join("\n");

  try {
    // Equal payloads within one UTC day share a provider key, limiting duplicate retries.
    const key = createHash("sha256").update(JSON.stringify(data) + new Date().toISOString().slice(0, 10)).digest("hex");
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `join-${key}` },
      body: JSON.stringify({ from: config.from, to: [config.to], reply_to: data.email, subject: "Echo of Palestine: expression of interest", text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!sent.ok) return response({ error: "We could not send your expression of interest. Please try again later or visit the official conference Facebook page." }, 502);
    const accepted: unknown = await sent.json();
    if (!accepted || typeof accepted !== "object" || !("id" in accepted) || typeof accepted.id !== "string" || !accepted.id) {
      return response({ error: "Submission could not be confirmed. Please try again later." }, 502);
    }
    return response({ success: true, message: "Your expression of interest has been submitted. This does not confirm membership or guarantee a response." }, 200);
  } catch {
    return response({ error: "We could not confirm your submission. Please try again later or use the official conference Facebook page." }, 502);
  }
}
