import { ToolGrid } from "@/components/tool-grid";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Free Contractor Financial Calculators",
  "Six free tools to estimate job profit, forecast cash flow, set labor rates, compare markup and margin, and assess change orders.",
  "/tools/",
);
export default function Tools() {
  return (
    <div className="container section">
      <span className="eyebrow">THE COMPLETE TOOLBOX</span>
      <h1>
        Make your next decision
        <br />
        with better numbers.
      </h1>
      <p className="intro">
        Six free calculators for the financial side of contracting. Choose a
        tool, adjust the hypothetical example, and see your results instantly.
      </p>
      <ToolGrid />
    </div>
  );
}
