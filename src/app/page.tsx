import Link from "next/link";
import { ArrowRight, Check, ArrowUpRight } from "lucide-react";
import { ToolGrid } from "@/components/tool-grid";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div>
          <span className="eyebrow">
            <span className="orange">■</span> BUILT FOR THE BUSINESS BEHIND THE
            BUILD
          </span>
          <h1>
            Good work deserves
            <br />
            <span className="orange">a profitable bid.</span>
          </h1>
          <p className="hero-copy">
            Stop guessing. Start bidding profitably. Free financial calculators
            to price your work, protect your cash, and know what you actually
            take home.
          </p>
          <div className="hero-actions">
            <Link className="button-link" href="/tools">
              Explore free calculators <ArrowRight size={18} />
            </Link>
            <Link className="text-link" href="/tools/job-profit-calculator">
              Calculate job profit <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="trust-line">
            <span>
              <Check size={15} /> No sign-up
            </span>
            <span>
              <Check size={15} /> 100% free
            </span>
            <span>
              <Check size={15} /> Your numbers stay here
            </span>
          </div>
        </div>
        <div className="estimate-card">
          <div className="estimate-head">
            <span>THE NUMBERS BEHIND THE JOB</span>
            <span className="example-tag">Hypothetical example</span>
          </div>
          <div className="estimate-project">
            <span>Residential renovation</span>
            <small>ESTIMATE / 001</small>
          </div>
          <div className="estimate-line">
            <span>Contract revenue</span>
            <strong>$55,000</strong>
          </div>
          <div className="estimate-line">
            <span>Direct job costs</span>
            <strong>$35,000</strong>
          </div>
          <div className="estimate-line">
            <span>Overhead + contingency expense</span>
            <strong>$6,500</strong>
          </div>
          <div className="estimate-result">
            <div>
              <span>Estimated job profit</span>
              <strong>
                $13,500<span>24.55% margin</span>
              </strong>
            </div>
            <div className="mini-bars">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <Link href="/tools/job-profit-calculator">
            What does your next job look like? <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <div className="principle-strip">
        <div className="container">
          <span>BUILT FOR U.S. CONTRACTORS</span>
          <span>
            Six practical tools. One clearer picture of your business.
          </span>
          <span>NO ACCOUNTS. NO PAYWALLS.</span>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR FINANCIAL TOOLBOX</span>
            <h2>Measure twice. Bid once.</h2>
          </div>
          <p>
            From the first estimate to the final change order,
            <br />
            make the math work for you.
          </p>
        </div>
        <ToolGrid />
      </section>
      <section className="education">
        <div className="container section">
          <span className="eyebrow">THE FUNDAMENTALS</span>
          <h2>Three distinctions that change the numbers.</h2>
          <div className="concept-grid">
            {[
              [
                "01",
                "Profit is not cash.",
                "A job can earn $10,000 on paper while you wait to collect the invoice. Payroll and materials still need to be paid. Model when the money arrives.",
                "contractor-cash-flow-calculator",
              ],
              [
                "02",
                "Markup is not margin.",
                "Adding 25% to a $10,000 cost gives a $12,500 price. Your profit margin is 20%. Different denominators mean different results.",
                "markup-vs-margin-calculator",
              ],
              [
                "03",
                "Revenue is not take-home.",
                "$50,000 in sales is only the starting point. Subtract direct costs, allocated overhead, and expected expenses to see the estimated job profit.",
                "job-profit-calculator",
              ],
            ].map(([n, title, body, slug]) => (
              <article key={n}>
                <span className="concept-number">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <Link className="text-link" href={"/tools/" + slug}>
                  Work through the numbers <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container methodology-callout">
        <div>
          <span className="eyebrow">TRANSPARENT BY DESIGN</span>
          <h2>No mystery math.</h2>
          <p>
            Every tool shows its formulas, assumptions, and limits. Your inputs
            stay in your browser.
          </p>
        </div>
        <Link className="button-link secondary" href="/methodology">
          Read our methodology <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
