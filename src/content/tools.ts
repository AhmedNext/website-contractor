export type Field = {
  key: string;
  label: string;
  initial: number;
  unit?: "%" | "hours" | "months" | "number";
  hint?: string;
};
export type Tool = {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: string;
  fields: Field[];
  formula: string;
  example: string;
  mistake: string;
  limitations: string;
  audience: string;
};
const f = (
  key: string,
  label: string,
  initial: number,
  unit?: Field["unit"],
  hint?: string,
): Field => ({ key, label, initial, unit, hint });
export const tools: Tool[] = [
  {
    slug: "job-profit-calculator",
    name: "Job Profit Calculator",
    short: "Job profit",
    category: "ESTIMATE & BID",
    description:
      "See what stays in your business after every job cost is covered.",
    audience:
      "General contractors and trade contractors preparing a bid or reviewing a completed estimate.",
    fields: [
      f("base", "Base contract revenue", 50000),
      f("changes", "Approved change-order revenue", 5000),
      f("materials", "Materials", 16000),
      f("labor", "Labor", 12000),
      f("subs", "Subcontractors", 4000),
      f("equipment", "Equipment", 1500),
      f("permits", "Permits and fees", 500),
      f("other", "Other direct job costs", 1000),
      f("overhead", "Allocated overhead", 4500),
      f(
        "contingency",
        "Expected contingency expense",
        2000,
        undefined,
        "Expected spending only. Unspent reserve cash is not an expense.",
      ),
      f("target", "Target profit margin", 20, "%"),
    ],
    formula:
      "Revenue = base contract + approved changes. Direct cost = materials + labor + subcontractors + equipment + permits + other. Total cost = direct cost + overhead + expected contingency expense. Profit = revenue − total cost. Margin = profit ÷ revenue. Target price = total cost ÷ (1 − target margin).",
    example:
      "A hypothetical $55,000 contract with $35,000 in direct costs, $4,500 overhead, and $2,000 expected contingency expense leaves $13,500 profit: a 24.55% margin. A 20% target margin requires a $51,875 price.",
    mistake:
      "Leaving out overhead makes a job look more profitable than it is. Counting the same overhead in both labor and allocated overhead makes it look less profitable. Include each cost once.",
    limitations:
      "This is an estimate before income tax and financing costs unless you enter them. Contingency is expected expense, not an automatic charge for a reserve.",
  },
  {
    slug: "contractor-break-even-calculator",
    name: "Contractor Break-Even Calculator",
    short: "Break-even",
    category: "PLAN YOUR BUSINESS",
    description: "Find the monthly job volume that covers your fixed overhead.",
    audience:
      "Owners with recurring fixed expenses and reasonably similar jobs.",
    fields: [
      f("fixed", "Monthly fixed overhead", 10000),
      f("revenue", "Average revenue per job", 15000),
      f("variable", "Average variable cost per job", 10000),
      f("profit", "Target monthly operating profit", 5000),
    ],
    formula:
      "Contribution per job = average revenue − variable cost. Contribution margin = contribution ÷ revenue. Break-even jobs = round up(fixed overhead ÷ contribution). Target jobs = round up((overhead + target profit) ÷ contribution).",
    example:
      "At $15,000 revenue and $10,000 variable cost, each hypothetical job contributes $5,000. Two jobs cover $10,000 monthly overhead; three produce a $5,000 operating profit.",
    mistake:
      "Do not include fixed overhead again in variable job costs. A contribution of zero or less cannot cover positive overhead by increasing job volume.",
    limitations:
      "Job sizes, capacity, seasonal overhead, and variable costs can change. Sales shown use whole jobs, so they can exceed the theoretical dollar break-even.",
  },
  {
    slug: "contractor-cash-flow-calculator",
    name: "Contractor Cash Flow Simulator",
    short: "Cash flow",
    category: "PROTECT YOUR CASH",
    description: "Spot the cash gap between paying your crew and getting paid.",
    audience:
      "Contractors using progress billing, delayed payment terms, or retainage.",
    fields: [
      f("opening", "Opening cash balance", 15000),
      f("paymentDelay", "Payment delay", 1, "months"),
      f("retainage", "Retainage", 10, "%"),
      f("release", "Retainage release month", 7, "months"),
      f(
        "advance",
        "Customer advance payment",
        0,
        undefined,
        "Received in month 1 and credited against the earliest invoices; it does not increase project revenue.",
      ),
    ],
    formula:
      "Regular receipts arrive invoice month + payment delay. Retainage = invoice balance after advance credit × retainage rate. Release occurs no earlier than the regular payment due month. Closing cash = opening cash + receipts + other inflows − expenses − other outflows. Funding gap = max(0, −lowest balance).",
    example:
      "A hypothetical $20,000 month-1 invoice with 10% retainage and a one-month delay pays $18,000 in month 2. The remaining $2,000 waits for release. Paying $12,000 in month 1 from $5,000 opening cash produces a $7,000 funding gap even though the job may be profitable.",
    mistake:
      "An invoice is not cash in the bank. Do not add an advance to invoice revenue: this model credits the advance against the earliest billings. Negative other cash flow means a cash outflow.",
    limitations:
      "Monthly end balances can miss an intra-month shortage. Taxes, borrowing costs, disputes, bad debt, and unbilled work are excluded unless entered as cash flows. Retainage on prepaid invoice portions is excluded; confirm your actual contract treatment. This is a planning model, not accounting advice.",
  },
  {
    slug: "labor-rate-calculator",
    name: "Labor Rate Calculator",
    short: "Labor rate",
    category: "PRICE YOUR LABOR",
    description:
      "Turn wages, burden, and nonbillable time into a sustainable hourly rate.",
    audience: "Employers setting an hourly charge-out rate for one worker.",
    fields: [
      f("wage", "Base hourly employee wage", 28),
      f(
        "burden",
        "Employer payroll burden",
        15,
        "%",
        "Your assumption, not a universal statutory rate. Exclude allowances entered below.",
      ),
      f("workers", "Annual workers’ compensation allowance", 3000),
      f("benefits", "Annual benefits allowance", 6000),
      f("paid", "Paid hours per year", 2080, "hours"),
      f("billable", "Billable hours per year", 1600, "hours"),
      f("overhead", "Annual allocated overhead per worker", 12000),
      f("target", "Target operating margin", 20, "%"),
    ],
    formula:
      "Annual wage = wage × paid hours. Payroll burden = annual wage × burden rate. Annual cost = wage + burden + workers’ compensation + benefits + overhead. Effective hourly cost = annual cost ÷ billable hours. Charge-out rate = effective cost ÷ (1 − target margin).",
    example:
      "A hypothetical $28 wage for 2,080 paid hours costs $58,240. Adding 15% payroll burden, $3,000 compensation allowance, $6,000 benefits and $12,000 overhead gives $87,976 annually. At 1,600 billable hours and a 20% margin, the hourly rate is $68.73.",
    mistake:
      "Dividing by all paid hours assumes every paid hour earns revenue. Vacation, training, travel, and downtime reduce billable capacity.",
    limitations:
      "This is a blended worker estimate. Overtime premiums, local requirements, utilization changes, and employment costs must be reflected in your own assumptions.",
  },
  {
    slug: "markup-vs-margin-calculator",
    name: "Markup vs. Margin Calculator",
    short: "Markup vs. margin",
    category: "SET YOUR PRICE",
    description:
      "Convert markup to margin and price a job without the common mix-up.",
    audience:
      "Estimators and owners translating a profit goal into a selling price.",
    fields: [
      f("cost", "Total job cost", 10000),
      f("rate", "Desired percentage", 25, "%"),
    ],
    formula:
      "Markup mode: selling price = cost × (1 + markup). Margin mode: selling price = cost ÷ (1 − margin). Profit = price − cost. Markup = profit ÷ cost. Margin = profit ÷ price.",
    example:
      "On a hypothetical $10,000 cost, 25% markup sets a $12,500 price and produces 20% margin. A 25% margin needs $13,333.33, equivalent to 33.33% markup. A 50% markup gives 33.33% margin.",
    mistake:
      "Adding 20% to cost produces a 16.67% margin, not a 20% margin. The denominator is the difference: markup uses cost, margin uses revenue.",
    limitations:
      "A margin of 100% or more cannot be achieved with positive costs. Ratios with a zero denominator are undefined and shown as unavailable.",
  },
  {
    slug: "change-order-profit-calculator",
    name: "Change Order Profit Calculator",
    short: "Change order",
    category: "MANAGE YOUR SCOPE",
    description: "Compare the original job with the real cost of added scope.",
    audience:
      "Contractors evaluating a proposed change before approval or tracking an approved change.",
    fields: [
      f("original", "Original contract value", 50000),
      f("cost", "Original estimated total costs", 40000),
      f("changes", "Change-order revenue", 5000),
      f("direct", "Additional direct costs", 2500),
      f("overhead", "Additional overhead", 500),
      f("delay", "Schedule-delay cost", 500),
      f("contingency", "Expected contingency expense", 250),
    ],
    formula:
      "Original profit = original revenue − original cost. Revised revenue = original revenue + change revenue. Revised cost = original cost + additional direct costs + overhead + delay cost + expected contingency expense. Incremental profit = change revenue − all additional costs.",
    example:
      "A hypothetical $50,000 job with $40,000 cost starts at $10,000 profit. A $5,000 change with $3,750 added cost lifts profit to $11,250, but revised margin becomes 20.45%. The change itself contributes $1,250.",
    mistake:
      "Price the schedule effect as well as materials and labor. A profitable change can still dilute the original contract margin.",
    limitations:
      "Proposed changes are scenarios, not collectible approved revenue. This tool models one change and excludes any cost or tax you have not entered.",
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
