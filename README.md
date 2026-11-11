# Echo of Palestine

Four public pages built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. The conference record is distinguished from the proposed International Student Solidarity Movement for Palestine. No database or custom server is required.

## Run locally

Requires Node.js 20.9+ and npm. On a fresh checkout:

```sh
npm ci
npm run dev
```

Open the Local URL printed by Next.js (normally http://localhost:3000).

## Email configuration

Copy `.env.example` to `.env.local`, then set:

- `RESEND_API_KEY`: a Resend API key with email sending permission.
- `JOIN_FORM_TO_EMAIL`: the initiative's designated recipient address.
- `JOIN_FORM_FROM_EMAIL`: a sender address on a Resend-verified domain. A display name is supported.

Restart the server after changing variables. Never commit `.env.local` or expose these variables with a `NEXT_PUBLIC_` prefix. The join page checks availability at request time. Without all three values, it explains that submissions are temporarily unavailable; the API returns 503. No success is shown unless Resend returns a successful response containing an email ID. Provider acceptance is not proof of inbox delivery.

The Route Handler uses Resend's HTTP API with a timeout, bounded request bodies, shared validation, a honeypot, an origin check, and provider idempotency for identical daily submissions. It sends plain-text mail and does not save submissions to a database, local files, localStorage, or application logs. Submitted data is handled by Resend and the recipient's email service. Before launch, the operator should confirm mailbox access, data retention practices, and responsibility for responding. Honeypot protection is basic; Vercel Firewall can provide deployment-level abuse controls if needed.

Integration reference: https://resend.com/docs/api-reference/emails/send-email

## Validate and build

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
npm start
```

The automated API tests compile the real handler in memory and mock the external provider. They do not send real emails. Before launch, submit a test with valid credentials, confirm receipt in the intended inbox, and exercise the error state with an invalid key.

## Deploy to Vercel

1. Push this project to your Git provider and import the repository in Vercel.
2. Use the Next.js framework preset, repository root directory, `npm run build`, and the default output settings.
3. Add the three email environment variables under Project Settings → Environment Variables for the intended environments. Verify the sender domain in Resend and add its required DNS records.
4. Deploy. Redeploy after changing environment variables.
5. Check all four routes, mobile navigation, and the expression of interest form on the deployment URL. Confirm an actual email reaches the recipient before announcing the form as operational.

The repository is ready for Vercel; deployment is not performed by the local build.

## Connect a Namecheap domain

1. In Vercel Project Settings → Domains, add `echoofpalestine.com` and `www.echoofpalestine.com`. Choose the apex as the primary domain and redirect www to it.
2. In Namecheap Domain List → Manage → Advanced DNS, use the exact A/CNAME/TXT records Vercel currently displays for this project. Do not use copied or historical Vercel IP addresses.
3. Remove only records that conflict with those hostnames. Preserve existing MX, mail-related TXT, and Resend verification records. If DNS is hosted elsewhere, make the changes at that DNS provider instead.
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
