import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";

// Compile the actual TypeScript sources in memory, without an added test dependency.
const nativeRequire = createRequire(import.meta.url);
const loaded = new Map();
function load(relative) {
  if (loaded.has(relative)) return loaded.get(relative);
  const source = readFileSync(new URL(`../src/${relative}.ts`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} };
  const require = (id) => id.startsWith("@/") ? load(id.slice(2)) : nativeRequire(id);
  new Function("require", "module", "exports", compiled)(require, compiledModule, compiledModule.exports);
  loaded.set(relative, compiledModule.exports);
  return compiledModule.exports;
}

const { POST } = load("app/api/join/route");
const valid = { fullName: "Test Student", email: "student@example.org", country: "Pakistan", organization: "Test University", participationType: "Individual student", message: "Interested in learning more.", privacy: true, website: "" };
const originalFetch = globalThis.fetch;
const variables = ["RESEND_API_KEY", "JOIN_FORM_TO_EMAIL", "JOIN_FORM_FROM_EMAIL"];
const originalEnv = Object.fromEntries(variables.map((key) => [key, process.env[key]]));
let calls = 0;
let providerStatus = 200;
let providerBody = { id: "mock-accepted-id" };
let providerThrows = false;
let lastRequest;

function request(data = valid, headers = {}) {
  return new Request("https://echoofpalestine.com/api/join", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://echoofpalestine.com", ...headers }, body: typeof data === "string" ? data : JSON.stringify(data) });
}

test.beforeEach(() => {
  calls = 0; providerStatus = 200; providerBody = { id: "mock-accepted-id" }; providerThrows = false;
  process.env.RESEND_API_KEY = "test-key";
  process.env.JOIN_FORM_TO_EMAIL = "recipient@example.org";
  process.env.JOIN_FORM_FROM_EMAIL = "sender@example.org";
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, "https://api.resend.com/emails");
    lastRequest = options;
    if (providerThrows) throw new Error("Simulated timeout");
    return Response.json(providerBody, { status: providerStatus });
  };
});
test.after(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

test("only provider acceptance with an ID returns success", async () => {
  const res = await POST(request());
  assert.equal(res.status, 200);
  assert.equal((await res.json()).success, true);
  assert.equal(calls, 1);
  const mail = JSON.parse(lastRequest.body);
  assert.equal(mail.reply_to, valid.email);
  assert.deepEqual(mail.to, ["recipient@example.org"]);
  assert.equal(mail.html, undefined);
  assert.match(mail.text, /Privacy acknowledgement: accepted/);
  assert.equal(res.headers.get("cache-control"), "no-store");
});

for (const [label, changes] of [
  ["missing name", { fullName: " " }], ["invalid email", { email: "wrong" }],
  ["header injection", { email: "test@example.org\r\nBcc: other@example.org" }],
  ["missing country", { country: "" }], ["unknown participation", { participationType: "Administrator" }],
  ["missing acknowledgement", { privacy: false }], ["string acknowledgement", { privacy: "true" }],
  ["filled honeypot", { website: "spam.example.org" }], ["oversized message", { message: "x".repeat(2001) }],
  ["wrong field type", { fullName: ["Test"] }],
]) test(`${label} cannot trigger an email`, async () => {
  const res = await POST(request({ ...valid, ...changes }));
  assert.equal(res.status, 400);
  assert.equal(calls, 0);
});

test("missing configuration returns honest unavailability", async () => {
  delete process.env.RESEND_API_KEY;
  const res = await POST(request());
  assert.equal(res.status, 503);
  assert.equal((await res.json()).success, undefined);
  assert.equal(calls, 0);
});
test("malformed JSON and non-object payloads are rejected", async () => {
  for (const value of ["{", "null", "[]"]) assert.equal((await POST(request(value))).status, 400);
  assert.equal(calls, 0);
});
test("oversized bodies are rejected with and without content-length", async () => {
  assert.equal((await POST(request("x", { "Content-Length": "20000" }))).status, 413);
  assert.equal((await POST(request(JSON.stringify({ message: "x".repeat(17000) })))).status, 413);
  assert.equal(calls, 0);
});
test("cross-origin requests and wrong content types are rejected", async () => {
  assert.equal((await POST(request(valid, { Origin: "https://other.example.org" }))).status, 403);
  assert.equal((await POST(request(valid, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal(calls, 0);
});
test("provider rejection cannot report success", async () => {
  providerStatus = 422; providerBody = { message: "Rejected" };
  const res = await POST(request());
  assert.equal(res.status, 502);
  assert.equal((await res.json()).success, undefined);
});
test("provider response without a valid ID cannot report success", async () => {
  for (const body of [{}, { id: "" }, { id: 42 }, null]) {
    providerBody = body;
    assert.equal((await POST(request())).status, 502);
  }
});
test("network failures cannot report success", async () => {
  providerThrows = true;
  const res = await POST(request());
  assert.equal(res.status, 502);
  assert.equal((await res.json()).success, undefined);
});
test("duplicate retries use the same provider idempotency key", async () => {
  await POST(request());
  const firstKey = lastRequest.headers["Idempotency-Key"];
  await POST(request());
  assert.equal(lastRequest.headers["Idempotency-Key"], firstKey);
});
