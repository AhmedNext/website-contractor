# Contractor Money Lab

Free financial calculators for U.S. contractors. Built with Next.js App Router, strict TypeScript, Tailwind CSS, shadcn/ui, Lucide, Zod, and Recharts. Calculations run in the browser without a backend or database.

## Development

Requires Node.js 24.

```sh
npm ci
npm run dev
```

- `npm run typecheck` — check TypeScript
- `npm run lint` — check source quality
- `npm run build` — export the site to `out/`
- `npm run preview` — preview the export at http://localhost:4173

## Structure

```text
src/app/                     pages, metadata, sitemap, and robots
src/components/ui/           shadcn/ui components
src/components/calculators/  shared calculator UI and interactive charts
src/components/ads/          disabled-by-default advertising integration
src/content/                 calculator definitions and editorial content
src/lib/                     calculation engines, validation, SEO, and utilities
public/                      social preview and responsive editorial images
scripts/                     static preview and export compatibility helper
```

The website includes six calculators: job profit, break-even, cash flow, labor rates, markup vs. margin, and change-order profit. About, methodology, contact, privacy, terms, and a custom 404 are included. Test suites, QA artifacts, and their dependencies have been removed at the owner's request.

Every calculator includes a live chart, an independent what-if scenario, hypothetical presets, a pinned result for comparison, and a copyable estimate summary. Exact chart values are available as tables. Pinned estimates and comparisons remain in page memory and clear on reload. Scenario adjustments do not change the main estimate inputs and are excluded from the copied estimate.

## Photography

The homepage, toolbox, and about page use three original AI-generated editorial illustrations, not photographs of customers or staff. Responsive 768px and 1536px WebP assets at quality 92 live in `public/images/`. The hero loads eagerly and its responsive sizing accounts for cropping; supporting photos load lazily. The [asset notes and generation prompts](public/images/README.md) document each source. Generated originals remain outside the repository; only compressed web assets are shipped.

Geist is self-hosted through `next/font/local`, with tabular numerals throughout the site. Its SIL Open Font License is included in `src/app/fonts/OFL.txt`; the source is [Vercel's official font repository](https://github.com/vercel/geist-font). Job costs have sticky category and column headings in the scrollable mobile table. The change-order builder's Print / Save PDF button opens the browser print dialog with a customer document layout, signature lines, and no internal costs.

## Deployment

Repository: https://github.com/AhmedNext/website-contractor
Production domain: https://contractormoneylab.website

In Cloudflare Pages, import the repository and select **Next.js (Static HTML Export)**:

- Branch: `main`
- Build command: `npm run build`
- Output directory: `out`
- Environment: `NODE_VERSION=24`

The build uses the supported webpack path. Its automatic postbuild step supplies static aliases for Next.js 16.4 segment filenames. Keep that step when deploying. No runtime server is required.

## Configuration

Copy `.env.example` to `.env.local` if needed. Never commit secrets.

- `SITE_URL` defaults to `https://contractormoneylab.website`. It controls canonical URLs, sitemap, social metadata, and structured data.
- `NEXT_PUBLIC_CONTACT_EMAIL` is optional until a real operator address is supplied. Email setup is deferred.
- Advertising is disabled. Before enabling it, configure the actual publisher and slot, connect `AdSlot.consentGranted` to an appropriate consent platform, and update the privacy policy. The enable flag alone does not grant consent.
- Analytics is optional and not active. Configure it through the hosting provider if needed and update the privacy policy.

Calculator inputs remain in page memory. The job tracker and change-order builder save records in browser localStorage, with JSON backup/restore and printable reports. Records are not sent to a server or synced between domains/devices. All example values are hypothetical. See the methodology page for formulas and assumptions.

