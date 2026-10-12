# Website quality review

Checked October 12, 2026. Tests used fictional figures on a local static preview; production customer drafts were not edited.

## Completed changes

- Contact, Terms and Privacy use the owner-provided public inbox, `fexo.4921@gmail.com`. Developer launch instructions were replaced with visitor-facing text. Terms and Privacy show a revision date.
- All 20 tool routes have a worked decision example and comparison table. Prices are explicitly hypothetical, with product or official references where relevant. The cost planner's defaults are planning assumptions, not surveyed regional rates.
- Shared document amount fields and the change-order margin now explain rejected empty, negative or oversized input instead of silently retaining a previous value. Percentage fields have their own bounds.

## Crawl accessibility

The live sitemap and robots file returned HTTP 200. All 28 sitemap URLs returned HTTP 200, one H1, the expected unique canonical and no detected noindex instruction. The `www` redirect returned 301 and preserved a nested path and query string. The generated static export also passed checks for canonical uniqueness, parsed JSON-LD, internal links and worked examples on all 20 tool routes.

Raw live checks are in [live-indexability.json](live-indexability.json). Requests using a Googlebot user-agent do not prove access by Google's actual crawler, nor that Google has indexed a page. Search Console sitemap status and URL Inspection are still needed for that conclusion. No sitemap failure was found.

## Calculator and browser checks

- 156 formula and schema assertions passed: financial defaults, zero costs, scaled large values, all seven takeoff engines, invalid and out-of-range inputs, invoice rounding, backup validation and cash-flow timing.
- Numeric tool pages were exercised in the browser with zero and oversized values. Geometry inputs rejected zero where a positive dimension is required; financial tools showed zero or an unavailable ratio where division would be undefined. No NaN or Infinity result was observed. The cost planner's area input was separately checked at zero and above its 10,000 ft² bound.
- All 20 tools were checked at a 375 × 844 viewport without document-level horizontal overflow. Wider comparison tables keep their own scroll regions. The job cost table's first column had computed `position: sticky`.
- Invoice arithmetic: $1,980 taxable material + $1,000 labor, 10% discount, 8% tax on taxable net and 5% pre-tax retainage produced $2,824.56 total and $2,690.46 current due. Zero quantity and an oversized calculated total disabled printing. Negative amounts and tax above 30% produced rejection messages. The oversized preview stayed within the mobile page.
- An invalid JSON backup was rejected with the current invoice preserved. A valid fictional backup required an explicit replacement choice; cancellation preserved $2,824.56, and confirmation restored a $100 invoice. Reload restored that document. JSON download produced a readable backup with the same fields.
- Job tracker: $20,000 estimated revenue / $15,000 estimated cost and $20,000 earned revenue / $17,000 actual cost produced $5,000 estimated profit, $3,000 profit to date and $2,000 over budget. Reload restored the draft.
- Change order: $1,400 added cost at 20% margin produced $1,750 price and $350 profit. At 25% it produced $1,866.67 and $466.67. A 100% margin was rejected visibly; reload retained the valid draft.
- A fictional California conditional waiver required review before print became available. Switching to unconditional cleared review; review alone was insufficient until cleared-payment acknowledgment was also selected. Texas, Florida and General state switches cleared print readiness and displayed the corresponding document title. This is a UI check, not a legal compliance certification.

## Print limitation and checks still needed

Print readiness, required-field gates and print stylesheet rules were checked. Invoking Print / Save PDF in the embedded browser caused its input command to time out; the browser's native print preview could not be inspected. No saved PDF, final pagination or physical print quality is claimed. Review a short and long document in a normal browser's print preview before relying on the customer copy. Storage quota failures and a full accessibility audit were not simulated.

## Build and search targeting

`npm run typecheck`, `npm run lint` and `npm run build` completed successfully. The build generated 34 static pages and finalized 28 segment aliases. No test framework or runtime dependency was added.

[seo-keyword-plan.md](seo-keyword-plan.md) maps every tool to primary and secondary search intent, available U.S. volume data and qualitative competitive evidence. Thirteen terms returned usable provider data; seven were unavailable and remain unknown. Third-party cached volume is not a traffic forecast, and ad competition is not organic ranking difficulty. Prioritize improvements to existing takeoff pages and measure actual Search Console queries before creating more calculators.
