# Contractor Money Lab

A complete browser-based contractor finance site built with Next.js 16.4, React 19.3, strict TypeScript, Tailwind 4, official shadcn/ui components (Base UI), Lucide, Zod, Recharts, Vitest, and Playwright. No backend, database, paid API, login, or mandatory analytics.

## Local development

Use Node.js 24 and npm. Run `npm ci`, then `npm run dev`. Development runs at http://localhost:3000. The project uses the supported webpack build path because the current Turbopack CSS worker failed in this Windows environment.

- `npm run typecheck` — TypeScript validation
- `npm run lint` — ESLint
- `npm test` — financial and validation tests
- `npm run build` — generate static `out/`
- `npm run preview` — serve `out/` at http://localhost:4173
- `npx playwright install chromium` — one-time browser install
- `npm run test:e2e` — interactions, metadata, responsiveness, and automated accessibility

## Structure

```text
src/
  app/                    static App Router routes, metadata, sitemap, robots
    [page]/               about, methodology, policies, contact
    tools/[slug]/         six statically generated calculator pages
  components/
    ui/                   official shadcn/ui components
    calculators/          shared live form, metrics, cash-flow chart
    ads/                  consent-gated, disabled-by-default AdSlot
  content/                tool inputs, examples, methodology, policies
  lib/                    pure engines, validation, SEO, formatting utilities
  tests/                  independent financial expected-value tests
public/                   logo and social preview assets
scripts/                  exported-site preview and local performance measurement
e2e/                     Playwright functional and axe accessibility tests
.github/workflows/        GitHub checks and visual QA artifacts
qa/                       generated screenshots and lab measurements (ignored)
out/                      generated deployment artifact (ignored)
```

## Routes

`/`, `/tools`, `/about`, `/methodology`, `/privacy-policy`, `/terms`, `/contact`, a custom 404, `/robots.txt`, `/sitemap.xml`.

Calculators: `/tools/job-profit-calculator`, `/tools/contractor-break-even-calculator`, `/tools/contractor-cash-flow-calculator`, `/tools/labor-rate-calculator`, `/tools/markup-vs-margin-calculator`, `/tools/change-order-profit-calculator`.

Every calculator has server-rendered explanations, formulas, worked examples, mistakes, assumptions, limitations, and related links. Inputs and results recalculate locally. Undefined denominators are unavailable. Rounding is for display only. Mobile has an immediate result summary plus the full breakdown below inputs.

shadcn components used: Button, Card, Input, Label, Sheet, Tabs, Tooltip, Accordion, Alert. Native tables and selects are used where simpler. Currency formatting uses `Intl.NumberFormat` with `en-US` and `USD`.

## Cloudflare Pages deployment

1. Create a GitHub repository and push this project; no remote account or repository was supplied here. The included workflow validates changes.
2. In Cloudflare Workers & Pages, create a **Pages** project and import the Git repository.
3. Choose **Next.js (Static HTML Export)**. Set build command to **`npm run build`**, output directory to **`out`**, and production branch to your actual branch (normally `main`). This override preserves the verified webpack build command.
4. Set `NODE_VERSION=24`, `SITE_URL` to the actual HTTPS production origin, and `NEXT_PUBLIC_CONTACT_EMAIL` to a real monitored address. Rebuild after changing configuration.
5. Inspect production routes, sitemap, canonical URLs, contact email, social previews, and 404 handling before launch. `out/404.html` is included; do not add an SPA catch-all redirect.

Official guide: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
Free-tier limits: https://developers.cloudflare.com/pages/platform/limits/

The application uses static assets only and needs no Workers runtime, paid service, VPS, or Docker. A free `pages.dev` address can be used; a custom domain is optional and has its own registration cost. Stay within the current published Pages free-tier limits.

## Production configuration

Copy `.env.example` to `.env.local` for local configuration; never commit secrets.

- `SITE_URL`: real origin without a trailing slash. Defaults to https://contractormoneylab.website. Override it when deploying to a different production domain. It controls canonical metadata, the sitemap, Organization, WebSite, WebApplication, BreadcrumbList, and absolute social previews.
- `NEXT_PUBLIC_CONTACT_EMAIL`: monitored operator address. The contact page provides a mailto link once configured; it transparently reports missing configuration otherwise.
- Analytics: optional and currently absent. The sample token variable alone does not activate analytics. Enable Cloudflare Web Analytics through the actual Pages dashboard if desired, and update the privacy policy to describe the actual service before enabling. No calculator inputs should be included in analytics events.
- AdSense: disabled. Obtain actual publisher approval, configure `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT`, and `NEXT_PUBLIC_ADS_ENABLED=true`, then connect `AdSlot.consentGranted` to the actual appropriate consent platform. The flag alone does not grant consent or request an ad. No custom generic consent banner is presented as a substitute for an applicable Google-certified CMP. Review the policy and regional consent requirements before activation. A configured slot reserves space below editorial content; it never covers the calculator. There is no fabricated ad or clickable placeholder. Publisher approval and a CMP were not supplied.

## Model details

Workers’ compensation and benefits are annual dollar allowances. Payroll burden is a user-entered percentage of annual wages excluding separately entered allowances. Contingency means expected expense, not unspent reserve.

Cash flow: advance arrives in month 1 and offsets earliest billings. Retainage applies to the balance after advance credit. Regular receipts arrive invoice month + delay. Retainage releases no earlier than payment eligibility. Amounts outside the 6/12-month horizon remain reported. Other cash flows affect cash only; project profit is total invoices less projected job expenses. Monthly end balances can miss intra-month funding pressure.

## Verification and remaining launch requirements

See `VERIFICATION.md` for actual results and testing limits. There is no deployed URL: no GitHub remote or Cloudflare account was provided. The production origin is configured as https://contractormoneylab.website. Public launch still requires operator contact, review of actual policies, and publisher/consent configuration only if ads are enabled. Inputs are never transmitted or saved.


## Export compatibility

The automatic postbuild step creates static aliases for the Next.js 16.4 exported segment filename mismatch, verified by browser resource and console checks. Deploy using `npm run build` so this step is included. No runtime server or rewrite is needed.

