import Link from "next/link";

const steps = [
  { title: "Start with the complete job cost", text: "Good work deserves a profitable bid, and that starts with the full scope. Add materials, crew labor, subcontractors, equipment and permits. Include delivery, disposal and other direct expenses. Then allocate the overhead this project needs to recover. A low bid can appear profitable when office expenses or owner production time are missing.", slug: "job-profit-calculator", link: "Estimate contractor job profit" },
  { title: "Choose a margin before setting the price", text: "Your target margin is the share of the selling price left after the entered costs. A $10,000 cost needs a $12,500 price to leave a 20% margin. Adding 20% to cost instead produces $12,000 revenue and a 16.67% margin. Use the comparison chart to see the difference before quoting the customer.", slug: "markup-vs-margin-calculator", link: "Compare markup and profit margin" },
  { title: "Recover labor costs across billable hours", text: "An employee's wage is one part of a charge-out rate. Payroll burden, workers' compensation, benefits and allocated overhead also need to be recovered. Divide annual cost by hours you can actually bill, rather than every paid hour. Travel, training and time between jobs can reduce the productive hours available to pay those costs.", slug: "labor-rate-calculator", link: "Calculate a burdened labor rate" },
  { title: "Check whether you can fund the schedule", text: "Profit does not tell you when an invoice will be collected. A supplier payment and Friday payroll can arrive before the customer's progress payment. Model monthly expenses, payment delay, deposits and retainage together. Review the lowest cash balance and any funding gap, then check payment dates more closely where the monthly forecast is tight.", slug: "contractor-cash-flow-calculator", link: "Forecast contractor cash flow" },
  { title: "Connect job volume to business overhead", text: "A profitable job contributes toward the fixed costs of running your business. The break-even calculator compares average job contribution with a monthly overhead budget and shows the number of whole jobs needed to cover it. Check that your crew and equipment can deliver that volume. Booked work is different from completed work and collected money.", slug: "contractor-break-even-calculator", link: "Find your break-even job volume" },
  { title: "Price and document changes before closeout", text: "Added scope can bring new revenue while also adding crew time, materials and schedule costs. Compare the revised job's profit with the original estimate. Then use the change-order builder to describe the work, exclusions, proposed price and approval details. Compare actual costs with the estimate after completion so the next bid uses evidence from your own jobs.", slug: "change-order-profit-calculator", link: "Review change-order profitability" },
];

export function HomeGuide() {
  return <section className="container section home-guide" aria-labelledby="planning-guide">
    <span className="eyebrow">FROM THE FIRST ESTIMATE TO THE FINAL INVOICE</span>
    <h2 id="planning-guide">How to build a more profitable contractor bid</h2>
    <p className="intro">Use these free contractor financial calculators in the order your job decisions happen. Enter your own figures, compare a scenario, and keep the assumptions alongside the estimate.</p>
    <div className="home-guide-grid">{steps.map((step, index) => <article key={step.slug}>
      <span className="concept-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p>
      <Link className="text-link" href={`/tools/${step.slug}/`}>{step.link} →</Link>
    </article>)}</div>
    <div className="guide-faq home-faq">
      <h2>Before you use the tools</h2>
      <details><summary>What profit margin should a contractor target?</summary><p>Start with complete costs, overhead recovery, capacity and the risks in your scope. These tools use hypothetical targets rather than prescribing an industry rate. A project&apos;s estimated margin and a company&apos;s annual net margin measure different things. For context, <a href="https://www.nahb.org/blog/2026/04/home-remodeling-profit-margin">NAHB&apos;s report on residential remodelers</a> distinguishes gross and net results; compare matching definitions when reviewing a benchmark.</p></details>
      <details><summary>Can I save an estimate or print a change order?</summary><p>Calculator inputs stay in page memory and clear on reload. You can copy a result summary. The <Link href="/tools/job-cost-tracker/">job cost tracker</Link> and <Link href="/tools/change-order-builder/">change-order builder</Link> save local browser drafts, support backup files and provide printable reports. A saved draft is not synchronized to another device.</p></details>
      <details><summary>Are these tools suitable for my trade?</summary><p>The general calculators accept your own dollar costs and assumptions. Our roofing and plumbing pages start with trade-specific hypothetical examples, while the remodeling template helps document an added scope of work. Local costs and contract requirements still come from your actual job. None of the examples is a local price survey.</p></details>
    </div>
  </section>;
}

