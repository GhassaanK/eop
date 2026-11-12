import { sendJoinEmail } from "@/lib/join-email";
import { validateJoin } from "@/lib/validation";
import { getJoinConfig } from "@/lib/join-config";

export const runtime = "nodejs";
export const maxDuration = 30;
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

  try {
    await sendJoinEmail(result.data, config);
    return response({ success: true, message: "Thank you for your interest. Your submission has been received." }, 200);
  } catch {
    return response({ error: "We couldn't submit your information right now. Please try again later." }, 502);
  }
}
