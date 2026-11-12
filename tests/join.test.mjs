import assert from "node:assert/strict";
import test from "node:test";
import { createSourceLoader } from "../scripts/load-server-source.mjs";

let calls = 0;
let closed = 0;
let lastMail;
let lastOptions;
let providerThrows = false;
let accepted = ["recipient@example.org"];
let rejected = [];
let releaseSend;
let holdSend = false;
const load = createSourceLoader({ nodemailer: { createTransport(options) {
  lastOptions = options;
  return { close() { closed++; }, async sendMail(mail) {
    calls++; lastMail = mail;
    if (providerThrows) throw new Error("Private SMTP authentication details");
    if (holdSend) await new Promise(resolve => { releaseSend = resolve; });
    return { accepted, rejected, messageId: "mock-smtp-message" };
  }};
}} });
const { POST } = load("app/api/join/route");
const valid = { fullName: "Test Student", email: "student@example.org", country: "Pakistan", organization: "Test University", participationType: "Individual student", message: "Interested in learning more.", privacy: true, website: "" };
const variables = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "JOIN_FORM_TO_EMAIL"];
const originalEnv = Object.fromEntries(variables.map(key => [key, process.env[key]]));
function request(data = valid, headers = {}) {
  return new Request("https://echoofpalestine.com/api/join", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://echoofpalestine.com", ...headers }, body: typeof data === "string" ? data : JSON.stringify(data) });
}
test.beforeEach(() => {
  calls = 0; closed = 0; providerThrows = false; holdSend = false;
  accepted = ["recipient@example.org"]; rejected = [];
  Object.assign(process.env, { SMTP_HOST: "smtp.example.org", SMTP_PORT: "465", SMTP_USER: "sender@example.org", SMTP_PASSWORD: "test-password", JOIN_FORM_TO_EMAIL: "recipient@example.org" });
});
test.after(() => { for (const [key, value] of Object.entries(originalEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });

test("SMTP acceptance returns the exact success message", async () => {
  const res = await POST(request());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true, message: "Thank you for your interest. Your submission has been received." });
  assert.equal(calls, 1); assert.equal(closed, 1);
  assert.equal(lastOptions.secure, true); assert.equal(lastOptions.port, 465);
  assert.equal(lastOptions.tls.rejectUnauthorized, true);
  assert.equal(lastOptions.debug, false); assert.equal(lastOptions.logger, false);
  assert.equal(lastOptions.disableFileAccess, true); assert.equal(lastOptions.disableUrlAccess, true);
  assert.equal(lastMail.from.address, "sender@example.org");
  assert.equal(lastMail.from.name, "Echo of Palestine");
  assert.equal(lastMail.to.address, "recipient@example.org");
  assert.equal(lastMail.replyTo.address, valid.email);
  assert.equal(lastMail.subject, `New Join Us Submission | ${valid.fullName}`);
  assert.match(lastMail.text, /Submission Timestamp \(UTC\): \d{4}-\d{2}-\d{2}T/);
  assert.match(lastMail.html, /Privacy acknowledgement/);
  assert.equal(lastMail.cc, undefined); assert.equal(lastMail.bcc, undefined);
  assert.equal(res.headers.get("cache-control"), "no-store");
});

test("success waits until sendMail resolves", async () => {
  holdSend = true; let resolved = false;
  const pending = POST(request()).then(res => { resolved = true; return res; });
  while (!releaseSend) await new Promise(resolve => setImmediate(resolve));
  assert.equal(resolved, false);
  releaseSend(); releaseSend = undefined;
  assert.equal((await pending).status, 200);
});

test("all untrusted email HTML is escaped", async () => {
  await POST(request({ ...valid, fullName: '<img src=x onerror="alert(1)">', organization: "A & B <script>bad()</script>", message: '<a href="https://evil.example">hello</a>\nsecond line' }));
  assert.ok(!lastMail.html.includes('<img src=x'));
  assert.ok(!lastMail.html.includes('<script>'));
  assert.ok(lastMail.html.includes('&lt;script&gt;'));
  assert.ok(lastMail.html.includes('A &amp; B'));
  assert.ok(lastMail.html.includes('&quot;'));
  assert.ok(lastMail.text.includes('<script>bad()</script>'));
});

for (const [label, changes] of [
  ["missing name", { fullName: " " }], ["invalid email", { email: "wrong" }],
  ["email header injection", { email: "test@example.org\r\nBcc: other@example.org" }],
  ["subject header injection", { fullName: "Name\nBcc:other@example.org" }],
  ["address list injection", { email: "a,b@example.org" }],
  ["missing country", { country: "" }], ["unknown participation", { participationType: "Administrator" }],
  ["missing acknowledgement", { privacy: false }], ["string acknowledgement", { privacy: "true" }],
  ["filled honeypot", { website: "spam.example.org" }], ["oversized message", { message: "x".repeat(2001) }],
  ["wrong field type", { fullName: ["Test"] }],
]) test(`${label} cannot trigger SMTP`, async () => {
  assert.equal((await POST(request({ ...valid, ...changes }))).status, 400);
  assert.equal(calls, 0);
});

for (const key of variables) test(`missing ${key} returns unavailable without SMTP`, async () => {
  delete process.env[key]; const res = await POST(request());
  assert.equal(res.status, 503); assert.equal((await res.json()).success, undefined); assert.equal(calls, 0);
});

test("insecure ports and malformed configured addresses are rejected", async () => {
  for (const [key, value] of [["SMTP_PORT", "587"], ["SMTP_USER", "Name <sender@example.org>"], ["JOIN_FORM_TO_EMAIL", "a@example.org,b@example.org"]]) {
    const before = process.env[key]; process.env[key] = value;
    assert.equal((await POST(request())).status, 503);
    process.env[key] = before;
  }
  assert.equal(calls, 0);
});
test("malformed JSON and non-object payloads are rejected", async () => {
  for (const value of ["{", "null", "[]"]) assert.equal((await POST(request(value))).status, 400);
  assert.equal(calls, 0);
});
test("oversized request bodies are rejected even without content-length", async () => {
  assert.equal((await POST(request("x", { "Content-Length": "20000" }))).status, 413);
  assert.equal((await POST(request(JSON.stringify({ message: "x".repeat(17000) })))).status, 413);
  assert.equal(calls, 0);
});
test("cross-origin requests and wrong content types are rejected", async () => {
  assert.equal((await POST(request(valid, { Origin: "https://other.example.org" }))).status, 403);
  assert.equal((await POST(request(valid, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal(calls, 0);
});
test("SMTP authentication and network errors never leak or return success", async () => {
  providerThrows = true;
  const res = await POST(request());
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { error: "We couldn't submit your information right now. Please try again later." });
  assert.equal(closed, 1);
});
test("an unaccepted or rejected recipient cannot report success", async () => {
  accepted = [];
  assert.equal((await POST(request())).status, 502);
  accepted = ["somebody-else@example.org"];
  assert.equal((await POST(request())).status, 502);
  accepted = ["recipient@example.org"]; rejected = ["recipient@example.org"];
  assert.equal((await POST(request())).status, 502);
});

test("the overall send deadline closes SMTP and returns a safe error", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  holdSend = true;
  const pending = POST(request());
  while (!releaseSend) await new Promise(resolve => setImmediate(resolve));
  context.mock.timers.tick(20_000);
  const result = await pending;
  assert.equal(result.status, 502);
  assert.ok(closed >= 1);
  assert.equal((await result.json()).success, undefined);
  releaseSend(); releaseSend = undefined;
});
