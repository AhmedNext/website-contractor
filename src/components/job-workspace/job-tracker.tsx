"use client";
import { useState } from "react";
import {
  jobsSchema,
  newJob,
  summarizeJob,
  usd,
  downloadFile,
  csvCell,
  type Job,
} from "@/lib/job-workspace";
import { useLocalDraft, MoneyInput } from "./storage";
const initial = {
  version: 1 as const,
  jobs: [
    {
      id: "first-job",
      name: "My first job",
      revenue: 0,
      actualRevenue: 0,
      complete: false,
      costs: [
        "Materials",
        "Labor (including owner labor)",
        "Subcontractors",
        "Equipment",
        "Permits and fees",
        "Allocated overhead",
        "Other costs",
      ].map((category) => ({ category, estimated: 0, actual: 0 })),
    },
  ],
};
export function JobTracker() {
  const { data, setData, ready, message, setMessage } = useLocalDraft(
    "cml-jobs-v1",
    jobsSchema,
    initial,
  );
  const [selected, setSelected] = useState("first-job");
  const [increase, setIncrease] = useState(10);
  const job = data.jobs.find((j) => j.id === selected) || data.jobs[0];
  const totals = summarizeJob(job);
  const update = (patch: Partial<Job>) =>
    setData({
      ...data,
      jobs: data.jobs.map((j) => (j.id === job.id ? { ...j, ...patch } : j)),
    });
  const changeCost = (
    index: number,
    field: "estimated" | "actual",
    value: number,
  ) =>
    update({
      costs: job.costs.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ),
    });
  const stressedProfit =
    totals.estimatedProfit - (job.costs[0].estimated * increase) / 100;
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 2000000) throw Error();
      const restored = jobsSchema.parse(JSON.parse(await file.text()));
      if (!confirm("Replace your saved jobs with this backup?")) return;
      setData(restored);
      setSelected(restored.jobs[0].id);
      setMessage("Backup restored.");
    } catch {
      setMessage(
        "This is not a valid job tracker backup. Your current jobs were kept.",
      );
    }
  }
  function exportCsv() {
    const rows = [
      ["Job", "Category", "Estimated cost", "Actual cost", "Cost overrun"],
      ...job.costs.map((c) => [
        job.name,
        c.category,
        c.estimated,
        c.actual,
        c.actual - c.estimated,
      ]),
      [
        job.name,
        "Revenue",
        job.revenue,
        job.actualRevenue,
        job.actualRevenue - job.revenue,
      ],
      [
        job.name,
        "Profit",
        totals.estimatedProfit,
        totals.actualProfit,
        totals.actualProfit - totals.estimatedProfit,
      ],
    ];
    downloadFile(
      "job-costs.csv",
      rows.map((r) => r.map(csvCell).join(",")).join("\r\n"),
      "text/csv;charset=utf-8",
    );
  }
  return (
    <div className="workbench">
      <div className="workspace-actions no-print">
        <label>
          Choose job
          <select
            aria-label="Choose job"
            value={job.id}
            disabled={!ready}
            onChange={(e) => setSelected(e.target.value)}
          >
            {data.jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name || "Untitled job"}
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={!ready || data.jobs.length >= 100}
          onClick={() => {
            const j = newJob();
            setData({ ...data, jobs: [...data.jobs, j] });
            setSelected(j.id);
          }}
        >
          New job
        </button>
        <button
          disabled={!ready}
          onClick={() =>
            downloadFile(
              "contractor-jobs-backup.json",
              JSON.stringify(data, null, 2),
            )
          }
        >
          Download backup
        </button>
        <label className="import-control">
          Restore backup
          <input
            disabled={!ready}
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              void restore(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <button onClick={exportCsv}>Export CSV</button>
        <button onClick={() => window.print()}>Print / save PDF</button>
      </div>
      <p role="status" className="storage-note no-print">
        {message} Clearing browser data removes saved jobs. Download backups
        regularly.
      </p>
      <fieldset disabled={!ready}>
        <legend>Job details</legend>
        <div className="workspace-fields">
          <label>
            Job name
            <input
              maxLength={200}
              value={job.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </label>
          <label>
            Estimated contract revenue ($)
            <MoneyInput
              label="Estimated contract revenue"
              value={job.revenue}
              onChange={(revenue) => update({ revenue })}
            />
          </label>
          <label>
            Earned revenue to date ($)
            <MoneyInput
              label="Earned revenue to date"
              value={job.actualRevenue}
              onChange={(actualRevenue) => update({ actualRevenue })}
            />
          </label>
        </div>
        <label className="check-label">
          <input
            type="checkbox"
            checked={job.complete}
            onChange={(e) => update({ complete: e.target.checked })}
          />{" "}
          Job is complete — all revenue and costs entered
        </label>
      </fieldset>
      <p>
        Earned revenue is work completed, including approved changes; it is not
        cash collected. Enter expenses incurred, including unpaid bills. Include
        owner labor and overhead once.
      </p>
      <div className="workspace-table-wrap">
        <table className="workspace-table">
          <caption>Costs for {job.name || "Untitled job"}</caption>
          <thead>
            <tr>
              <th>Category</th>
              <th>Estimated ($)</th>
              <th>Actual to date ($)</th>
              <th>Over / under budget</th>
            </tr>
          </thead>
          <tbody>
            {job.costs.map((c, i) => (
              <tr key={i}>
                <th scope="row">{c.category}</th>
                <td>
                  <MoneyInput
                    label={`${c.category} estimated`}
                    value={c.estimated}
                    onChange={(v) => changeCost(i, "estimated", v)}
                  />
                </td>
                <td>
                  <MoneyInput
                    label={`${c.category} actual`}
                    value={c.actual}
                    onChange={(v) => changeCost(i, "actual", v)}
                  />
                </td>
                <td className={c.actual > c.estimated ? "cost-warning" : ""}>
                  {usd(c.actual - c.estimated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="workspace-results">
        <article>
          <span>Estimated profit</span>
          <strong>{usd(totals.estimatedProfit)}</strong>
          <small>
            {job.revenue
              ? ((totals.estimatedProfit / job.revenue) * 100).toFixed(1) +
                "% margin"
              : "Enter revenue for margin"}
          </small>
        </article>
        <article>
          <span>
            {job.complete
              ? "Completed job profit"
              : "Profit to date (not final)"}
          </span>
          <strong>{usd(totals.actualProfit)}</strong>
          <small>
            {job.actualRevenue
              ? ((totals.actualProfit / job.actualRevenue) * 100).toFixed(1) +
                "% margin"
              : "Enter earned revenue for margin"}
          </small>
        </article>
        <article>
          <span>Actual cost minus full budget</span>
          <strong>{usd(totals.costVariance)}</strong>
          <small>Positive = over budget; negative = under budget so far</small>
        </article>
      </div>
      {!job.complete && (
        <p className="workspace-notice">
          This job is in progress. Costs and revenue may arrive at different
          times; profit to date is not a forecast of final profit.
        </p>
      )}
      <section className="workspace-scenario">
        <h2>What if materials get more expensive?</h2>
        <label>
          Material cost increase (%)
          <input
            type="number"
            min="0"
            max="1000"
            value={increase}
            onChange={(e) => {
              const n = e.target.valueAsNumber;
              if (Number.isFinite(n) && n >= 0 && n <= 1000) setIncrease(n);
            }}
          />
        </label>
        <p>
          With estimated materials increasing by {increase}%, estimated profit
          becomes <strong>{usd(stressedProfit)}</strong>. Keeping the same
          dollar profit would require{" "}
          <strong>
            {usd(job.revenue + (job.costs[0].estimated * increase) / 100)}
          </strong>{" "}
          in revenue. This scenario does not change your saved estimate.
        </p>
      </section>
      <button
        className="danger-action no-print"
        disabled={!ready || data.jobs.length === 1}
        onClick={() => {
          if (
            confirm(
              `Delete ${job.name}? Download a backup first if you need it.`,
            )
          )
            setData({
              ...data,
              jobs: data.jobs.filter((j) => j.id !== job.id),
            });
        }}
      >
        Delete this job
      </button>
    </div>
  );
}
