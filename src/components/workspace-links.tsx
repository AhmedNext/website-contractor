import Link from "next/link";
export function WorkspaceLinks() {
  return (
    <section className="workspace-links no-print">
      <div>
        <span className="eyebrow">FROM THE BID TO THE LAST INVOICE</span>
        <h2>Keep the job profitable.</h2>
        <p>
          Track where costs change and put added work in writing. Free, with no
          account.
        </p>
      </div>
      <div className="workspace-link-grid">
        <Link href="/tools/job-cost-tracker/">
          <h3>Estimate vs. actual job tracker →</h3>
          <p>
            Save jobs, compare costs, check material increases, and export
            reports.
          </p>
        </Link>
        <Link href="/tools/change-order-builder/">
          <h3>Printable change-order builder →</h3>
          <p>
            Document extra scope, price it, and record approval before work
            begins.
          </p>
        </Link>
      </div>
    </section>
  );
}
