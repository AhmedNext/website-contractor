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


## Editorial content and specialist tools

The six calculator pages include server-rendered guides, worked examples and native HTML FAQs (roughly 950–1,000 words per guide including the formula/example). Factual benchmarks cite NAHB; employer payroll-rate discussion cites IRS. The text separates project margins from company net profit. Examples are hypothetical, not local price surveys or promised results.

Three specialist routes reuse the calculation engines with tailored defaults and distinct guides:

- `/tools/roofing-job-profit-calculator/`
- `/tools/plumbing-labor-rate-calculator/`
- `/tools/remodeling-change-order-template/`

The remodeling example must be loaded explicitly with confirmation. It uses the existing single change-order browser draft; loading an example can replace that draft. The homepage and toolbox link to these pages, and the sitemap lists each canonical URL. FAQ answers are present in the exported HTML; no unsupported FAQ rich-result eligibility is claimed. An Apple touch icon is included.

## Canonical domain redirect (Cloudflare account setting)

The preferred hostname is `contractormoneylab.website`. Canonical tags already use it, but they do not replace an HTTP redirect. Cloudflare Pages `_redirects` does not support domain-level source matching; adding a catch-all path redirect would risk redirecting the preferred hostname into itself.

Follow [Cloudflare's www-to-apex instructions](https://developers.cloudflare.com/pages/how-to/www-redirect/): create and enable a Bulk Redirect list/rule with source `www.contractormoneylab.website`, target `https://contractormoneylab.website`, status **301**, subpath matching, preserve path suffix and preserve query string. Configure a proxied DNS `A` record for `www` to `192.0.2.1` as described in that guide, replacing a parking record if present. Keep the root Pages record intact. Enable Always Use HTTPS in the zone if HTTP does not already redirect.

Alternatively, in the domain's **Rules > Redirect Rules**, use the **Redirect from WWW to root** Single Redirect template. Set the wildcard request URL to `https://www.contractormoneylab.website/*`, target URL to `https://contractormoneylab.website/${1}`, status 301, and preserve query string. This narrower wildcard rule preserves the path and applies only to HTTPS requests for the www hostname. The www DNS record must be proxied. [Cloudflare's migration guide](https://developers.cloudflare.com/rules/reference/page-rules-migration/) documents this configuration. Use one redirect approach, not duplicate rules.

Verify both the homepage and a nested path with a query string after applying the rule. `https://www.contractormoneylab.website/tools/job-profit-calculator/?source=check` must redirect to `https://contractormoneylab.website/tools/job-profit-calculator/?source=check` with status 301; the destination must return 200. These settings require authenticated dashboard or API access and cannot be applied through a source-code deploy alone.

## Visual takeoff suite and document studios

`/field-lab/` links to nine additional static routes defined in `src/content/field-tools.ts`. Seven tools use a shared, dependency-free SVG visualizer with per-tool quantity math in `src/lib/takeoff.ts`: concrete slab/perimeter footing, roofing, straight-wall framing, drywall, room geometry, aggregate and an editable cost spectrum. Polygon room vertices have pointer handles plus coordinate inputs for keyboard use. Every input has explicit units and bounds; invalid geometry hides the bid. Mobile quick sliders sit next to the diagram. Diagrams simplify large repeated layouts and never represent approved construction or structural details.

The estimate/invoice studio stores one local draft under `cml-estimate-v1`. A takeoff's Prepare estimate line action places one validated pending line in sessionStorage; the studio adds it only after an explicit click. JSON restore requires confirmation. Line amounts round to cents; discount is proportional, tax applies to marked net lines and retainage reduces current due without reducing total earned. Print / Save PDF uses the browser's print dialog. Short documents are compact; longer documents paginate without clipping rows.

The lien studio stores one local draft under `cml-lien-v1`. California forms follow current CSLB documents for Civil Code §§8132–8138; Texas forms reproduce Property Code §53.284; Florida forms use §713.20, including an explicitly labeled check-payment condition when selected. Florida Notice to Owner uses §713.06(2)(c). Official source links and notices remain visible. Unconditional forms require the user's cleared-payment acknowledgment. Print requires complete fields and review; no signature, delivery, service, filing, deadline or payment verification is performed. General drafts are explicitly not universal or state-approved. Other states' payment notices are ordinary correspondence, not statutory lien notices. Changes and restored backups clear review acknowledgments.

Each new route has a roughly 1,100-word server-rendered guide and visible FAQ content. WebApplication, HowTo, FAQPage and breadcrumb JSON-LD describe the rendered functionality. Google has deprecated HowTo rich results and restricts FAQ rich results; this markup does not promise eligibility, ranking, traffic or revenue. The cost-spectrum defaults and material densities are clearly labeled illustrative assumptions. Bag yields cite the selected QUIKRETE product.

No new runtime dependency, backend, email collection, WebGL engine or account flow was added. All tools retain static export compatibility. The existing financial tools remain available. A failed local draft parse preserves the original stored value until the user edits or explicitly restores a backup.
