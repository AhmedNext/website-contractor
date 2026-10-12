export type PracticalExample = {
  title: string;
  setup: string;
  rows: [string, string, string][];
  decision: string;
  verify: string;
  source?: { label: string; href: string };
};
const concreteSource = { label: "QUIKRETE: Concrete Mix product yields", href: "https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf" };
const payrollSource = { label: "IRS: Employer’s Tax Guide", href: "https://www.irs.gov/publications/p15" };
const changeExample: PracticalExample = {
  title: "Price a customer-requested cabinet addition",
  setup: "$600 labor + $450 materials + $200 subcontractors/equipment + $150 overhead/delay = $1,400 extra cost. This is added scope, separate from the original job.",
  rows: [["20% markup", "$1,680 price", "$280 profit; 16.67% margin"], ["20% margin", "$1,750 price", "$350 profit; 20% margin"], ["$200 unpriced return visit", "$1,750 price", "$150 profit; 8.57% margin"]],
  decision: "Confirm the extra scope, exclusions, price and schedule with the customer before work. Recover a return visit in the price or explicitly accept its profit effect.",
  verify: "Check the original agreement’s change-approval process, actual tax treatment, supplier delivery and who can authorize the work. The builder records information; it does not verify approval.",
};
export const practicalExamples: Record<string, PracticalExample> = {
  "concrete-slab-footing-calculator": {
    title: "Compare a garage slab order before calling the supplier",
    setup: "A 24 × 24 ft solid slab, 6 inches thick, contains 10.67 yd³ net. With 10% purchase allowance, the order is 11.73 yd³. These are measured quantities, not a thickness recommendation.",
    rows: [["Ready-mix at $165/yd³", "$1,936 material", "Before delivery, short-load or waiting charges"], ["80 lb bags at $6/bag", "528 bags; $3,168", "0.60 ft³ published yield; rounded up"], ["60 lb bags at $5/bag", "704 bags; $3,520", "0.45 ft³ published yield; rounded up"]],
    decision: "Compare delivered cost and placement capacity, not bag price alone. Add gravel, reinforcement, labor and supplier charges separately, then apply your bid margin once.",
    verify: "Obtain a dated supplier quote, actual mix specification, truck access and pour plan. Confirm engineered depth and reinforcement independently.", source: concreteSource,
  },
  "roofing-pitch-shingle-calculator": {
    title: "See why footprint area is not your shingle order",
    setup: "Use a 40 × 24 ft building with 12-inch overhangs on each side, a simple roof and 10% order allowance. Assume three bundles per square and 400 ft² usable underlayment coverage per roll.",
    rows: [["4/12 pitch", "1,151.07 ft² roof", "38 bundles; 4 rolls"], ["6/12 pitch", "1,220.89 ft² roof", "41 bundles; 4 rolls"], ["10/12 pitch", "1,421.47 ft² roof", "47 bundles; 4 rolls"]],
    decision: "Measure the roof configuration and use the slope-adjusted area. Price tear-off, flashing, starter and ridge products separately; the field-bundle count does not include them.",
    verify: "Read the selected product’s installed coverage and overlap rules. Three bundles per square is a product assumption, not a universal package size.",
    source: { label: "GAF: bundle coverage varies by product", href: "https://www.gaf.com/en-us/blog/your-home/how-many-bundles-of-shingles-are-in-a-square---63a47862-f7e1-4e73-abcf-8d09917a8b8d" },
  },
  "wall-stud-framing-calculator": {
    title: "Compare purchasing for one straight wall",
    setup: "A 24 ft wall, 8 ft overall height, three 1.5-inch plates, two corners with two extra studs each, and a 10% purchase allowance. No door or window openings are included.",
    rows: [["16-inch spacing", "19 regular + 4 extra", "26 purchased studs"], ["24-inch spacing", "13 regular + 4 extra", "19 purchased studs"], ["Either layout", "7 ft 7½ in cut length", "79.2 linear ft of plates with allowance"]],
    decision: "Compare quantities only after the permitted framing layout is established. This difference does not mean wider spacing is acceptable for your wall.",
    verify: "Check plans, loads, openings, headers, backing and available stock lengths. The sketch omits structural design and cutting optimization.",
  },
  "drywall-sheet-mud-calculator": {
    title: "Choose sheet size for a 24 × 8 ft surface",
    setup: "The gross area is 192 ft² with no openings deducted. A 10% allowance raises the area-based purchase basis to 211.2 ft².",
    rows: [["4 × 8 ft sheets", "7 sheets", "48.4 ft modeled joint tape with allowance"], ["4 × 12 ft sheets", "5 sheets", "39.6 ft modeled joint tape with allowance"], ["400 ft²/bucket assumption", "1 compound bucket", "Coverage must match your product and finish"]],
    decision: "Larger sheets reduce the modeled joints, but compare handling, access and usable cuts before choosing. An opening deduction may leave small offcuts rather than reduce the order by a whole sheet.",
    verify: "Check sheet specifications, actual cut layout, finishing level, compound yield and accessories. Tape here excludes perimeter edges and opening returns.",
    source: { label: "USG: Sheetrock wallboard material estimator", href: "https://assemblies-tools.usg.com/content/usgcom/en/resource-center/tools/sheetrockestimator.html" },
  },
  "room-square-footage-calculator": {
    title: "Avoid buying flooring for an L-shaped room’s missing corner",
    setup: "Measure a 20 × 16 ft outside rectangle with an 8 × 6 ft cutout. For this comparison, use 10% allowance and an illustrative $4/ft² flooring price.",
    rows: [["Outside rectangle only", "320 ft² net; 352 ft² order", "$1,408 material"], ["Subtract the cutout", "272 ft² net; 299.2 ft² order", "$1,196.80 material"], ["Difference", "52.8 ft² order area", "$211.20 before installation"]],
    decision: "Break the room into measured shapes and confirm the cutout. For tile, also enter box coverage; for paint, switch to wall area and verify openings and coats.",
    verify: "Supplier carton sizes, layout direction, seams, damaged-piece allowance and surface preparation can change the purchase order.",
  },
  "aggregate-dirt-tonnage-calculator": {
    title: "Compare a supplier’s ton quote with a yard quote",
    setup: "A 24 × 12 ft pad at 4 inches contains 3.56 yd³ net. Use a 1.0 loose/placed factor, 10% allowance and an illustrative 105 lb/ft³ density: 3.91 yd³ ordered, or 5.54 U.S. short tons.",
    rows: [["$45 per short ton", "$249.48 material", "Uses the entered density"], ["$65 per cubic yard", "$254.22 material", "Same order volume"], ["Density increased to 120 lb/ft³", "6.34 short tons; $285.12", "Same geometry; different weight"]],
    decision: "Ask suppliers for the same delivered material and quantity basis. Compare delivery, minimum load and compaction assumptions before choosing the apparent lower price.",
    verify: "Bulk density and moisture are supplier-specific. A short ton is 2,000 lb; do not confuse it with a metric tonne or assume the tool knows actual truck capacity.",
  },
  "construction-cost-per-square-foot-calculator": {
    title: "Normalize two quotes before comparing their square-foot rates",
    setup: "For a 400 ft² garage slab, the starting $6–$14/ft² range is hypothetical. Use a current quote for your actual area and scope instead of treating the midpoint as a market average.",
    rows: [["Low assumption: $6/ft²", "$2,400", "Only useful if scope is comparable"], ["Midpoint assumption: $10/ft²", "$4,000", "Mathematical midpoint, not surveyed average"], ["High assumption: $14/ft²", "$5,600", "Check included prep and finishing"]],
    decision: "List excavation, base, reinforcement, finishing, disposal, access and taxes for both quotes. Move the slider only after adjusting for omitted work. The entered installed rate already includes the costs you assume; do not add the same margin twice.",
    verify: "Record quote date, location, quantities and exclusions. The region field is a label and performs no automatic regional adjustment.",
  },
  "contractor-estimate-invoice-generator": {
    title: "Make the payment due clear when there is retainage",
    setup: "$1,980 taxable materials + $1,000 nontaxable labor, a 10% proportional discount, 8% tax on taxable net and 5% retainage on pre-tax net. Tax treatment is an illustration, not a state tax rule.",
    rows: [["Subtotal less discount", "$2,980 − $298", "$2,682 pre-tax net"], ["Tax and total", "$142.56 tax", "$2,824.56 total"], ["Current payment", "$134.10 retained", "$2,690.46 due now"]],
    decision: "Show both total amount and current due so retained money is not mistaken for a discount. Download the editable JSON backup separately from the PDF snapshot.",
    verify: "Review applicable tax rules, payment terms, taxable lines, acceptance and retainage treatment before using a real invoice.",
  },
  "subcontractor-lien-waiver-generator": {
    title: "Match the waiver to the actual payment event",
    setup: "A subcontractor is asked for a release covering a $5,000 progress payment. The work continues and there is a separate disputed change. The document must reflect the actual state and transaction.",
    rows: [["Payment promised or check pending", "Review a conditional progress form", "Do not assert cleared payment"], ["Funds actually received and cleared", "Review an unconditional progress form", "Read its warning and exceptions"], ["Final payment / closeout", "Review the applicable final form", "Progress and final language differ"]],
    decision: "Compare the release period, payment amount and exceptions against payment records before signing. General drafts are review drafts, not forms certified for every state.",
    verify: "Use the linked official state form or statute and obtain review for your facts. The generator does not determine deadlines, serve notices or verify funds.",
    source: { label: "California CSLB: conditional and unconditional releases", href: "https://cslb.ca.gov/consumers/Legal_Issues_For_Consumers/Mechanics_Lien/Conditional_And_Unconditional_Waiver_Release_Form.aspx" },
  },
  "job-profit-calculator": {
    title: "Check what happens when a supplier revises the bid",
    setup: "A $55,000 contract has $35,000 direct costs, $4,500 allocated overhead and $2,000 expected contingency spending. Total modeled cost is $41,500.",
    rows: [["Original estimate", "$13,500 profit", "24.55% margin"], ["$3,000 extra material cost", "$10,500 profit", "19.09% margin"], ["20% margin on revised $44,500 cost", "$55,625 required price", "$625 above current revenue"]],
    decision: "Review substitutions, scope and an agreed price adjustment before committing to the revised purchase. Cost growth consumes profit dollar for dollar when revenue stays fixed.",
    verify: "Include each cost once and separate approved revenue from proposed changes. Income tax and financing are excluded unless entered.",
  },
  "contractor-break-even-calculator": {
    title: "Test a discount against the monthly workload it creates",
    setup: "Monthly fixed overhead is $10,000. Each similar job costs $10,000 in variable expenses. Target monthly operating profit is $5,000.",
    rows: [["$15,000 selling price", "$5,000 contribution", "2 jobs to break even; 3 for target"], ["$14,000 selling price", "$4,000 contribution", "3 jobs to break even; 4 for target"], ["$10,000 selling price", "$0 contribution", "No volume covers positive overhead"]],
    decision: "A $1,000 discount can require another whole job to reach the same monthly target. Check crew capacity and collection timing before trading margin for volume.",
    verify: "Job mix and seasonal costs may invalidate an average-job model. Keep fixed overhead out of variable cost to avoid counting it twice.",
    source: { label: "SBA: break-even calculation", href: "https://legacy.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point" },
  },
  "contractor-cash-flow-calculator": {
    title: "A profitable invoice can still leave payroll unfunded",
    setup: "Start with $5,000 cash, bill $20,000 in month 1, spend $12,000 in month 1, and retain 10% until month 3. Other months’ invoices, expenses and other flows are zero.",
    rows: [["No delay or advance", "$11,000 month-1 closing cash", "$2,000 waits for retainage release"], ["One-month payment delay", "−$7,000 month-1 closing cash", "$7,000 modeled funding gap"], ["One-month delay + $8,000 advance", "$1,000 month-1 closing cash", "Advance offsets billing; it is not extra revenue"]],
    decision: "Compare actual agreed deposit and collection terms before mobilizing. Do not treat forecast invoicing as money available for payroll.",
    verify: "Review bank cash and daily payment dates; month-end forecasts can miss an earlier shortage. A deposit may have a different retainage treatment under your contract.",
  },
  "labor-rate-calculator": {
    title: "Compare the same worker at two billable-hour levels",
    setup: "$28/hour × 2,080 paid hours, 15% illustrative payroll burden, $3,000 workers’ compensation, $6,000 benefits and $12,000 allocated overhead produce $87,976 annual cost. Target operating margin is 20%.",
    rows: [["1,600 billable hours", "$54.99 cost/hour", "$68.73 charge-out/hour"], ["1,200 billable hours", "$73.31 cost/hour", "$91.64 charge-out/hour"], ["Zero billable hours", "Hourly result unavailable", "Annual costs still exist"]],
    decision: "Track nonbillable travel, estimating, leave and callbacks. Increasing the wage input alone does not describe the cost of an hour sold.",
    verify: "Build burden from actual employer charges and benefits. The 15% example is not a statutory rate; avoid counting workers’ compensation twice.", source: payrollSource,
  },
  "markup-vs-margin-calculator": {
    title: "Two ways to add 20% produce different bids",
    setup: "Use $8,000 complete job cost. Choose either markup on cost or a target margin on selling price.",
    rows: [["20% markup", "$9,600 price; $1,600 profit", "16.67% margin"], ["20% margin", "$10,000 price; $2,000 profit", "25% markup"], ["25% margin", "$10,666.67 price", "33.33% markup"]],
    decision: "Ask whether a quoted percentage means markup or margin before using it. A 100% target margin has no finite selling price for positive cost.",
    verify: "Use the complete cost basis and check any contractual pricing method. This conversion does not choose a market price for you.",
  },
  "change-order-profit-calculator": changeExample,
  "change-order-builder": changeExample,
  "remodeling-change-order-template": changeExample,
  "roofing-job-profit-calculator": {
    title: "Protect the roof bid against hidden decking work",
    setup: "Illustrative signed price $18,000, complete estimated cost $13,500, including tear-off, disposal, materials, crew, overhead and expected contingency spending.",
    rows: [["Estimated roof job", "$4,500 profit", "25% margin"], ["Unpriced $1,800 decking work", "$2,700 profit", "15% margin"], ["Agreed $2,250 addition", "$4,950 combined profit", "24.44% on $20,250 revenue"]],
    decision: "Document the measured decking scope and approved price before treating it as revenue. The example addition prices $1,800 extra cost at a 20% margin.",
    verify: "Check concealed-condition clauses, disposal, code work and access. Proposed additions are scenarios until approved.",
  },
  "plumbing-labor-rate-calculator": {
    title: "Account for unbilled service travel before quoting an hourly rate",
    setup: "Use the trade example’s $103,044 annual worker cost and a 20% target margin. Compare billable utilization, keeping wages and annual costs unchanged.",
    rows: [["1,400 billable hours", "$73.60 hourly cost", "$92.00 required hourly price"], ["1,100 billable hours", "$93.68 hourly cost", "$117.10 required hourly price"], ["Call-out fee charged separately", "Review what it recovers", "Do not recover the same expense twice"]],
    decision: "Use representative service records, including callbacks and travel. Keep separately sold materials and diagnostic fees distinct from the employee labor rate.",
    verify: "Reconcile allocated overhead and burden with actual records. This rate does not set a city-specific market price or a service-call minimum.", source: payrollSource,
  },
  "job-cost-tracker": {
    title: "Separate an under-budget job from an unfinished job",
    setup: "A job has $20,000 estimated revenue and $15,000 estimated total cost. Costs incurred so far are $9,000. That does not mean the final cost will be $9,000.",
    rows: [["Work still in progress", "$6,000 below full budget so far", "Review commitments and remaining work"], ["Completed at $17,000 actual cost", "$2,000 cost overrun", "$3,000 profit if actual revenue is $20,000"], ["Completed at $18,000 actual revenue", "Same $17,000 actual cost", "$1,000 profit"]],
    decision: "Mark completion accurately and update actual revenue as well as costs. Use a completed job’s category differences to improve the next estimate.",
    verify: "Include unpaid incurred bills consistently and distinguish actual cost from payments. Export or back up records before clearing storage or switching devices.",
  },
};
