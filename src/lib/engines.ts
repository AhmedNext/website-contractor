export type Values = Record<string, number>;
export type Metric = {
  label: string;
  value: number | null;
  percent?: boolean;
  count?: boolean;
};
const ratio = (a: number, b: number) => (b === 0 ? null : (a / b) * 100);
export function calculate(kind: string, v: Values): Metric[] {
  const m = (
    label: string,
    value: number | null,
    percent = false,
    count = false,
  ) => ({ label, value, percent, count });
  const target = (cost: number) =>
    v.target >= 100 ? null : cost / (1 - v.target / 100);
  if (kind === "job-profit-calculator") {
    const revenue = v.base + v.changes,
      direct =
        v.materials + v.labor + v.subs + v.equipment + v.permits + v.other,
      cost = direct + v.overhead + v.contingency,
      profit = revenue - cost;
    return [
      m("Estimated job profit", profit),
      m("Profit margin", ratio(profit, revenue), true),
      m("Total contract revenue", revenue),
      m("Direct costs", direct),
      m("Gross profit before overhead", revenue - direct),
      m("Total estimated costs", cost),
      m("Markup on total cost", ratio(profit, cost), true),
      m("Break-even contract value", cost),
      m("Price for target margin", target(cost)),
      m("Profit with costs 10% higher", revenue - cost * 1.1),
    ];
  }
  if (kind === "contractor-break-even-calculator") {
    const c = v.revenue - v.variable,
      jobs = c > 0 ? Math.ceil(v.fixed / c) : null;
    return [
      m("Break-even jobs per month", jobs, false, true),
      m("Contribution per job", c),
      m("Contribution margin", ratio(c, v.revenue), true),
      m(
        "Sales at break-even job volume",
        jobs === null ? null : jobs * v.revenue,
      ),
      m(
        "Jobs for target profit",
        c > 0 ? Math.ceil((v.fixed + v.profit) / c) : null,
        false,
        true,
      ),
      ...[1, 3, 5, 10].map((n) =>
        m(`Operating profit at ${n} jobs`, n * c - v.fixed),
      ),
    ];
  }
  if (kind === "labor-rate-calculator") {
    const wage = v.wage * v.paid,
      burden = (wage * v.burden) / 100,
      total = wage + burden + v.workers + v.benefits + v.overhead,
      cost = v.billable > 0 ? total / v.billable : null;
    return [
      m(
        "Recommended hourly charge-out rate",
        cost === null ? null : target(cost),
      ),
      m("Effective cost per billable hour", cost),
      m("Annual wage expense", wage),
      m("Annual employer payroll burden", burden),
      m("Total annual worker-related cost", total),
    ];
  }
  if (kind === "markup-vs-margin-calculator") {
    const price =
        v.mode === 0
          ? v.cost * (1 + v.rate / 100)
          : v.rate >= 100
            ? null
            : v.cost / (1 - v.rate / 100),
      profit = price === null ? null : price - v.cost;
    return [
      m("Required selling price", price),
      m("Dollar profit", profit),
      m("Markup on cost", profit === null ? null : ratio(profit, v.cost), true),
      m(
        "Profit margin",
        profit === null || price === null ? null : ratio(profit, price),
        true,
      ),
    ];
  }
  const old = v.original - v.cost,
    extra = v.direct + v.overhead + v.delay + v.contingency,
    revenue = v.original + v.changes,
    cost = v.cost + extra;
  return [
    m("Revised estimated profit", revenue - cost),
    m("Revised margin", ratio(revenue - cost, revenue), true),
    m("Original estimated profit", old),
    m("Original margin", ratio(old, v.original), true),
    m("Revised revenue", revenue),
    m("Revised cost", cost),
    m("Incremental profit or loss", v.changes - extra),
    m("Maximum total additional cost", v.changes),
    m("Remaining additional cost capacity", v.changes - extra),
  ];
}
export type CashRow = {
  month: number;
  opening: number;
  received: number;
  paid: number;
  net: number;
  closing: number;
  receivables: number;
};
export function cashFlow(
  v: Values,
  months: number,
): { rows: CashRow[]; metrics: Metric[] } {
  const invoices = Array.from(
      { length: months },
      (_, i) => v[`invoice${i}`] || 0,
    ),
    expenses = Array.from({ length: months }, (_, i) => v[`expense${i}`] || 0);
  let advanceRemaining = v.advance,
    balance = v.opening,
    billed = 0,
    collectedAgainstInvoices = 0;
  const events: Record<number, number> = {};
  invoices.forEach((invoice, i) => {
    const credit = Math.min(advanceRemaining, invoice);
    advanceRemaining -= credit;
    const remaining = invoice - credit;
    const retain = (remaining * v.retainage) / 100;
    const due = i + 1 + v.paymentDelay;
    events[due] = (events[due] || 0) + remaining - retain;
    const release = Math.max(due, v.release);
    events[release] = (events[release] || 0) + retain;
  });
  const rows: CashRow[] = [];
  for (let i = 0; i < months; i++) {
    const month = i + 1,
      opening = balance,
      received = (events[month] || 0) + (i === 0 ? v.advance : 0),
      other = v[`other${i}`] || 0,
      paid = expenses[i] + Math.max(0, -other);
    balance += received + Math.max(0, other) - paid;
    billed += invoices[i];
    collectedAgainstInvoices += events[month] || 0;
    const credited = Math.min(v.advance, billed);
    rows.push({
      month,
      opening,
      received: received + Math.max(0, other),
      paid,
      net: balance - opening,
      closing: balance,
      receivables: Math.max(0, billed - credited - collectedAgainstInvoices),
    });
  }
  const lowest = Math.min(v.opening, ...rows.map((r) => r.closing)),
    worst = rows.find((r) => r.closing === lowest);
  return {
    rows,
    metrics: [
      { label: "Lowest projected cash balance", value: lowest },
      { label: "Maximum funding gap", value: Math.max(0, -lowest) },
      {
        label: "Month of lowest cash (0 = opening)",
        value: worst?.month ?? 0,
        count: true,
      },
      {
        label: "Project profit (invoices minus job expenses)",
        value:
          invoices.reduce((a, b) => a + b, 0) -
          expenses.reduce((a, b) => a + b, 0),
      },
      {
        label: "Collections beyond forecast",
        value: Object.entries(events)
          .filter(([m]) => Number(m) > months)
          .reduce((a, [, n]) => a + n, 0),
      },
      { label: "Unapplied customer advance", value: advanceRemaining },
    ],
  };
}
