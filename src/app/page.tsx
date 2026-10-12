import { WorkspaceLinks } from "@/components/workspace-links";
import Link from "next/link";
import { ArrowRight, Check, ArrowUpRight } from "lucide-react";
import { ToolGrid } from "@/components/tool-grid";
import { EditorialPhoto } from "@/components/editorial-photo";
import { HomeGuide } from "@/components/home-guide";
import { TradeLinks } from "@/components/trade-links";
import { FieldToolGrid } from "@/components/field-lab/field-tool-grid";
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
        <div className="hero-visual">
          <EditorialPhoto
            photo="contractor-estimate"
            alt="Contractor reviewing an estimate and plans at a renovation workbench"
            eager
          />
          <span className="photo-kicker">ON SITE. ON BUDGET.</span>
          <Link
            className="hero-profit-note"
            href="/tools/job-profit-calculator"
          >
            <div>
              <span className="eyebrow">
                A CLEARER PICTURE OF YOUR NEXT JOB
              </span>
              <strong>
                $13,500 <small>estimated profit</small>
              </strong>
              <p>$55,000 revenue − $41,500 costs · Hypothetical example</p>
            </div>
            <span className="photo-link-arrow">
              <ArrowUpRight size={23} />
            </span>
          </Link>
        </div>
      </section>
      <div className="container">
        <WorkspaceLinks />
      </div>
      <div className="principle-strip">
        <div className="container">
          <span>BUILT FOR U.S. CONTRACTORS</span>
          <span>
            Visual quantities. Practical pricing. One clearer picture.
          </span>
          <span>NO ACCOUNTS. NO PAYWALLS.</span>
        </div>
      </div>
      <section className="container section"><div className="section-heading"><div><span className="eyebrow">MEASURE IT. SEE IT. PRICE IT.</span><h2>Your takeoff, brought to life.</h2><p>Live architectural diagrams turn dimensions into materials and a bid you can explain.</p></div><Link className="text-link" href="/field-lab/">Explore the visual field lab →</Link></div><FieldToolGrid featured /></section>
      <section className="container section">
        <div className="section-heading toolbox-heading">
          <div>
            <span className="eyebrow">YOUR FINANCIAL TOOLBOX</span>
            <h2>Measure twice. Bid once.</h2>
          </div>
          <EditorialPhoto
            photo="plans-and-tools"
            alt="Plans, a calculator and well-used tools on a jobsite workbench"
            className="toolbox-photo"
          />
        </div>
        <ToolGrid />
      </section>
      <section className="education">
        <div className="container section">
          <div className="fundamentals-heading">
            <div>
              <span className="eyebrow">THE FUNDAMENTALS</span>
              <h2>Good decisions start before the work does.</h2>
              <p>
                Three distinctions that change the numbers, from the first bid
                to the last invoice.
              </p>
            </div>
            <EditorialPhoto
              photo="framing-crew"
              alt="Two carpenters discussing a plan inside a timber-framed house"
            />
          </div>
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
                  {slug === "contractor-cash-flow-calculator" ? "Check payment timing" : slug === "markup-vs-margin-calculator" ? "See markup vs. margin" : "Review the job costs"} <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div className="container"><TradeLinks /></div>
      <HomeGuide />
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
