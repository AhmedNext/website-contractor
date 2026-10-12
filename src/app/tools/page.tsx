import { WorkspaceLinks } from "@/components/workspace-links";
import { ToolGrid } from "@/components/tool-grid";
import { meta } from "@/lib/seo";
import { EditorialPhoto } from "@/components/editorial-photo";
import { TradeLinks } from "@/components/trade-links";
import { FieldToolGrid } from "@/components/field-lab/field-tool-grid";
export const metadata = meta(
  "Free Contractor Financial Calculators",
  "Free job tracking, printable change orders, and six calculators to estimate job profit, forecast cash flow, set labor rates, compare markup and margin, and assess change orders.",
  "/tools/",
);
export default function Tools() {
  return (
    <div className="container section">
      <div className="tools-intro">
        <div>
          <span className="eyebrow">THE COMPLETE TOOLBOX</span>
          <h1>
            Make your next decision
            <br />
            with better numbers.
          </h1>
          <p className="intro">
            Visual takeoffs, financial calculators and private document studios.
            Choose a tool, replace the hypothetical example, and see your results instantly.
          </p>
        </div>
        <EditorialPhoto
          photo="plans-and-tools"
          alt="A contractor's plans, calculator and tools ready for estimating"
          eager
        />
      </div>
      <WorkspaceLinks />
      <section className="toolbox-group"><span className="eyebrow">MEASURE. SEE. PRICE.</span><h2>Visual takeoffs & field utilities</h2><FieldToolGrid /></section>
      <section className="toolbox-group"><span className="eyebrow">THE BUSINESS BEHIND THE BUILD</span><h2>Financial calculators</h2>
      <ToolGrid />
      </section>
      <TradeLinks />
    </div>
  );
}
