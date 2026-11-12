import nextEnv from "@next/env";
import { createSourceLoader } from "./load-server-source.mjs";

// Sends exactly one labelled test to the configured organization mailbox.
// Never prints environment values, provider errors, or submitted personal data.
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const load = createSourceLoader();
const config = load("lib/join-config").getJoinConfig();
if (!config) {
  console.error("SMTP test skipped: required SMTP configuration is missing or invalid.");
  process.exitCode = 1;
} else {
  const { POST } = load("app/api/join/route");
  const response = await POST(new Request("https://echoofpalestine.com/api/join", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "https://echoofpalestine.com" },
    body: JSON.stringify({ fullName: "SMTP integration test", email: config.user, country: "Pakistan", organization: "Echo of Palestine website test", participationType: "Other", message: `Controlled integration test, not a membership application. Please confirm receipt of this test separately. Created at ${new Date().toISOString()}.`, privacy: true, website: "" }),
  }));
  const result = await response.json();
  if (response.ok && result.success === true) {
    console.log("PASS: the real Join API awaited SMTP acceptance of one controlled test email.");
    console.log("Inbox receipt remains unconfirmed. Check the designated mailbox and spam folder separately.");
  } else {
    console.error(`FAIL: Join API returned HTTP ${response.status}. No delivery success was reported.`);
    process.exitCode = 1;
  }
}
