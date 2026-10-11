import { WorkspaceLinks } from "@/components/workspace-links";
import { ToolGrid } from "@/components/tool-grid";
import { meta } from "@/lib/seo";
import { EditorialPhoto } from "@/components/editorial-photo";
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
            Six free calculators for the financial side of contracting. Choose a
            tool, adjust the hypothetical example, and see your results
            instantly.
          </p>
        </div>
        <EditorialPhoto
          photo="plans-and-tools"
          alt="A contractor's plans, calculator and tools ready for estimating"
          eager
        />
      </div>
      <WorkspaceLinks />
      <ToolGrid />
    </div>
  );
}
