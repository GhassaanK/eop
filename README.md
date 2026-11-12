# Echo of Palestine

Four public pages built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. The conference record is distinguished from the proposed International Student Solidarity Movement for Palestine. No database or custom server is required.

## Run locally

Requires Node.js 20.9+ and npm. On a fresh checkout:

```sh
npm ci
npm run dev
```

Open the Local URL printed by Next.js (normally http://localhost:3000).

## HostCry SMTP configuration

The existing Join form sends through Nodemailer and HostCry, with no third-party sending API or database. Nodemailer and its TypeScript definitions are already included in the project.

Keep the following values in untracked `.env.local` for local development and in Vercel's server-side environment variables for deployment:

- `SMTP_HOST=eu1.hostbuddy.us`
- `SMTP_PORT=465`
- `SMTP_USER=partner@echoofpalestine.com`
- `SMTP_PASSWORD`: the existing HostCry mailbox password. Never commit it or prefix it with `NEXT_PUBLIC_`.
- `JOIN_FORM_TO_EMAIL=partner@echoofpalestine.com`

The example file contains placeholders only. Preserve existing real values when updating `.env.local`. Restart local development after changing variables; redeploy Vercel after changing its configuration. Port 465 uses immediate TLS with certificate verification enabled.

The sender is `"Echo of Palestine" <SMTP_USER>`; the recipient is `JOIN_FORM_TO_EMAIL`. Reply-To is the submitter's validated address. Applicants do not receive an automated confirmation email. The organization receives an escaped HTML email and a plain-text alternative with the form fields, privacy acknowledgement, and UTC submission timestamp.

The Node.js Route Handler awaits SMTP acceptance for the designated recipient before returning success. It bounds input to 16 KiB, retains strict server validation, rejects header injection, and checks the honeypot and request origin. SMTP connection, greeting, DNS, and socket timeouts are configured, with an overall 20-second send deadline and a 30-second route budget. Client requests time out after 30 seconds. SMTP credentials, internal provider errors, and applicant personal information are not logged. Nodemailer is protected by the server-only import boundary.

If configuration is missing or invalid, the page shows temporary unavailability and the API returns HTTP 503. SMTP failures return HTTP 502 with a generic message; the form retains its entries. The form resets only after success. No data is saved in browser storage, a database, or runtime files.

### Rate limiting and duplicate submissions

The client disables the button while sending and uses an immediate submission guard to block concurrent clicks. There is no durable, distributed rate limiter or submission store in this service-free implementation. An in-memory Map would not enforce a production-wide limit across Vercel instances, so one is not used. Honeypot, origin checks, payload limits, and validation remain active. If deployment-level rate controls are available in the current Vercel plan, configure them for POST /api/join. Do not describe the honeypot as a distributed rate limiter.

SMTP does not provide provider idempotency. A connection lost after server acceptance can make the outcome uncertain; a later manual retry may create a duplicate email. The site never reports success for an unconfirmed outcome. Inbox arrival and spam placement must be confirmed separately from SMTP acceptance.

### SMTP connection troubleshooting

If DNS and TCP port 465 are reachable but the TLS handshake times out before authentication, ask HostCry to verify that `eu1.hostbuddy.us:465` is serving implicit TLS and allows the source network and Vercel deployment. Confirm the recommended SMTP hostname and certificate configuration with the provider. Do not disable TLS verification or change ports to conceal the failure. After the connection issue is resolved, run `npm run test:smtp` once and confirm the labelled message in the mailbox separately.

Transport reference: https://nodemailer.com/smtp

## Validate and build

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
npm start
```

The automated API tests compile the real handler in memory and mock Nodemailer. They cover SMTP acceptance, awaited sending, missing configuration, HTML escaping, header injection, malformed payloads, limits, recipient rejection, and safe failure handling. They do not send real emails.

To send exactly one clearly labelled controlled email through the actual Join API code using local SMTP credentials:

```sh
npm run test:smtp
```

This sends to the configured organizational mailbox, never to an applicant. A passing result confirms SMTP acceptance only. Check the mailbox and spam folder separately for the subject `New Join Us Submission | SMTP integration test`. To test the UI locally, run `npm run dev`, open `/join-us`, check required-field errors, then make one intentional test submission and confirm its receipt. To test failure handling without changing the real password, rely on `npm test` or use a separate local test environment.

## Deploy to Vercel

1. Push this project to your Git provider and import the repository in Vercel.
2. Use the Next.js framework preset, repository root directory, `npm run build`, and the default output settings.
3. Add all five SMTP environment variables under Project Settings → Environment Variables for the intended environments. Use port 465 and the HostCry mailbox password. Confirm HostCry permits SMTP connections from the deployment.
4. Deploy. Redeploy after changing environment variables.
5. Check all four routes, mobile navigation, and the expression of interest form on the deployment URL. Confirm an actual email reaches the recipient before announcing the form as operational.

The repository is ready for Vercel; deployment is not performed by the local build.

## Connect a Namecheap domain

1. In Vercel Project Settings → Domains, add `echoofpalestine.com` and `www.echoofpalestine.com`. Choose the apex as the primary domain and redirect www to it.
2. In Namecheap Domain List → Manage → Advanced DNS, use the exact A/CNAME/TXT records Vercel currently displays for this project. Do not use copied or historical Vercel IP addresses.
3. Remove only records that conflict with those hostnames. Preserve existing MX, mail-related TXT, and existing mail authentication records (SPF, DKIM, DMARC). If DNS is hosted elsewhere, make the changes at that DNS provider instead.
4. Wait until Vercel reports valid DNS configuration and issues HTTPS. Verify both hostnames and their redirect.

Vercel reference: https://vercel.com/docs/domains/working-with-domains/add-a-domain

## Update content

- Home and the three inner pages: `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/vision-mission/page.tsx`, `src/app/join-us/page.tsx`.
- Complete supplied vision, foundation, and priorities: `src/content/site-content.ts`.
- Domain, official social reference, navigation, and metadata helper: `src/lib/site.ts`.
- Shared design tokens and responsive rules: `src/app/site.css`; Tailwind setup: `src/app/globals.css`.
- Shared header, footer, and UI: `src/components/`.
- Form constraints: `src/lib/validation.ts`; server submission: `src/app/api/join/route.ts`.

Preserve the supplied vision and strategic foundation. Describe proposed activity as intended work. Do not infer that conference participants are movement members. The About page links the historical sources. Official Facebook photos were subsequently reviewed in the browser and their source references are recorded in `assets/conference/README.md`.

## Branding assets

The supplied official EOP logo is preserved in `public/brand/eop-conference-logo.jpg`, with an optimized WebP copy for navigation and footer. Three authentic conference photographs were selected from the official Facebook page at the client’s request. The website serves local WebP copies from `public/images/`, with source originals and dated Facebook references preserved in `assets/conference/`. Captions distinguish the 2025 conference from the proposed student movement. Earlier illustrative explorations are retained in `assets/artwork/` and are not displayed.

To replace an image, preserve its source original and provenance, then update the relevant `next/image` source, dimensions, alt text, and caption. Do not recolor or distort the logo. The browser favicon uses the EOP lettering from the supplied identity, with 16, 32, 48, and 64 pixel sizes. Matching PNG and Apple touch icons are included. The full source logo remains unchanged.

## Content and launch confirmations

Confirm the movement's operating contact, privacy and retention arrangements before launch. The site makes no claims about founders, membership numbers, chapters, partners, or completed programs. Exactly four primary pages are included; sitemap, robots, Open Graph image, 404, and the form API are technical routes.

## Temporary social destinations

The footer uses the real official Facebook URL. At the client’s request, Instagram and X temporarily link to `eop-conference`, and WhatsApp uses the dummy Pakistan-format number `+92 300 0000000`. These are placeholders, not verified accounts or a working contact number. Instagram and X handles cannot normally contain hyphens; replace these with confirmed, platform-valid handles before launch. Update all destinations in `src/lib/site.ts`. No messages are sent by the site itself.
