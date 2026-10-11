import Link from "next/link";
import { JobTracker } from "@/components/job-workspace/job-tracker";
import { meta } from "@/lib/seo";
export const metadata = meta(
  "Job Cost Tracker: Estimate vs. Actual",
  "Track estimated and actual contractor job costs, see profit differences, and export a job report without an account.",
  "/tools/job-cost-tracker/",
);
export default function Page() {
  return (
    <div className="container section workspace-page">
      <nav className="breadcrumbs no-print" aria-label="Breadcrumb">
        <Link href="/tools/">Tools</Link>
        <span>/</span>
        <span>Job Cost Tracker</span>
      </nav>
      <span className="eyebrow no-print">FREE JOB WORKSPACE</span>
      <h1>Job Cost Tracker: Estimate vs. Actual</h1>
      <p className="intro no-print">
        Track estimated and actual contractor job costs, see profit differences,
        and export a job report without an account.
      </p>
      <JobTracker />
      <section className="editorial no-print">
        <h2>How to use this tool</h2>
        <p>
          Compare your original bid with costs incurred as work progresses.
          Record owner labor, supplier bills, subcontractors, and overhead to
          see where profit changes. A negative cost difference means under the
          full budget so far, not necessarily money saved. Review completed jobs
          to improve your next estimate.
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
        <Link href="/tools/change-order-builder/">Build a change order →</Link>
      </section>
    </div>
  );
}
