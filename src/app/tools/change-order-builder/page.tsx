import Link from "next/link";
import { ChangeBuilder } from "@/components/job-workspace/change-builder";
import { meta } from "@/lib/seo";
import { PracticalExample } from "@/components/practical-example";
export const metadata = meta(
  "Contractor Change Order Builder",
  "Create a printable change order with added scope, costs, target margin, schedule impact, and an approval record.",
  "/tools/change-order-builder/",
);
export default function Page() {
  return (
    <div className="container section workspace-page">
      <nav className="breadcrumbs no-print" aria-label="Breadcrumb">
        <Link href="/tools/">Tools</Link>
        <span>/</span>
        <span>Contractor Change Order Builder</span>
      </nav>
      <span className="eyebrow no-print">FREE JOB WORKSPACE</span>
      <h1>Contractor Change Order Builder</h1>
      <p className="intro no-print">
        Create a printable change order with added scope, costs, target margin,
        schedule impact, and an approval record.
      </p>
      <ChangeBuilder />
      <PracticalExample slug="change-order-builder" />
      <section className="editorial no-print">
        <h2>How to use this tool</h2>
        <p>
          Small extras add up. Document each request while it is fresh, price
          its labor and material costs, and agree on the change before starting
          the added work. Price = added costs ÷ (1 − target margin). A 20%
          margin on $800 of costs gives a $1,000 price, not $960. Approval
          status is your own record; it does not collect a customer signature.
        </p>
        <h3>Keep your records safe</h3>
        <p>
          Saved work stays in this browser on this device. It does not sync
          between devices or between the pages.dev and custom domain addresses.
          Download a backup before switching addresses or clearing browser data.
          Restore that file to move your work.
        </p>
        <h3>Understand the limits</h3>
        <p>
          Amounts are in U.S. dollars. This is a planning aid, not accounting
          software. Check your inputs and include applicable taxes, financing,
          and other expenses yourself. Do not count costs twice.
        </p>
        <Link href="/tools/job-cost-tracker/">Track job costs →</Link>
      </section>
    </div>
  );
}
