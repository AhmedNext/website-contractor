"use client";
import {
  blankChange,
  changeSchema,
  priceChange,
  usd,
  downloadFile,
  type Change,
} from "@/lib/job-workspace";
import { useLocalDraft, MoneyInput } from "./storage";
export function ChangeBuilder() {
  const { data, setData, ready, message, setMessage } = useLocalDraft(
    "cml-change-v1",
    changeSchema,
    blankChange,
  );
  const update = (patch: Partial<Change>) => setData({ ...data, ...patch });
  const totals = priceChange(data);
  const approved =
    data.status === "Approved" &&
    !!data.approvedBy.trim() &&
    !!data.approvedDate;
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 100000) throw Error();
      const value = changeSchema.parse(JSON.parse(await file.text()));
      if (!confirm("Replace this change order with the backup?")) return;
      setData(value);
      setMessage("Backup restored.");
    } catch {
      setMessage("Invalid change-order backup. Your current draft was kept.");
    }
  }
  return (
    <div className="workbench change-workbench">
      <div className="workspace-actions no-print">
        <button disabled={!ready} onClick={() => window.print()}>
          Print / save PDF
        </button>
        <button
          disabled={!ready}
          onClick={() =>
            downloadFile(
              "change-order-backup.json",
              JSON.stringify(data, null, 2),
            )
          }
        >
          Download backup
        </button>
        <label className="import-control">
          Restore backup
          <input
            type="file"
            disabled={!ready}
            accept=".json,application/json"
            onChange={(e) => {
              void restore(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <button
          disabled={!ready}
          onClick={() => {
            if (
              confirm(
                "Start a new change order? Download a backup to keep this one first.",
              )
            )
              setData({
                ...blankChange,
                date: new Date().toLocaleDateString("en-CA"),
              });
          }}
        >
          New change order
        </button>
      </div>
      <p role="status" className="storage-note no-print">
        {message} One draft is saved at a time. Download a backup for each
        change order you want to keep.
      </p>
      <fieldset disabled={!ready}>
        <legend>Change-order details</legend>
        <div className="workspace-fields">
          {(
            [
              ["job", "Job / project"],
              ["customer", "Customer"],
              ["contractor", "Contractor / business"],
              ["number", "Change-order number"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                maxLength={key === "number" ? 100 : 200}
                value={data[key]}
                onChange={(e) => update({ [key]: e.target.value })}
              />
            </label>
          ))}
          <label>
            Date
            <input
              type="date"
              value={data.date}
              onChange={(e) => update({ date: e.target.value })}
            />
          </label>
          <label>
            Status
            <select
              aria-label="Status"
              value={data.status}
              onChange={(e) =>
                update({ status: e.target.value as Change["status"] })
              }
            >
              {["Draft", "Sent", "Approved", "Declined"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Added scope and exclusions
          <textarea
            rows={5}
            maxLength={10000}
            placeholder="Describe the requested extra work, quantities, and what is excluded."
            value={data.scope}
            onChange={(e) => update({ scope: e.target.value })}
          />
        </label>
        <label>
          Schedule impact
          <textarea
            rows={2}
            maxLength={2000}
            placeholder="Additional working days, dependencies, or no schedule change."
            value={data.schedule}
            onChange={(e) => update({ schedule: e.target.value })}
          />
        </label>
        <div className="workspace-fields">
          {data.costs.map((c, i) => (
            <label key={c.label}>
              {c.label} ($)
              <MoneyInput
                label={c.label}
                value={c.amount}
                onChange={(amount) =>
                  update({
                    costs: data.costs.map((v, n) =>
                      n === i ? { ...v, amount } : v,
                    ),
                  })
                }
              />
            </label>
          ))}
          <label>
            Target profit margin (%)
            <input
              type="number"
              min="0"
              max="95"
              step="0.1"
              value={data.margin}
              onChange={(e) => {
                const margin = e.target.valueAsNumber;
                if (Number.isFinite(margin) && margin >= 0 && margin <= 95)
                  update({ margin });
              }}
            />
          </label>
        </div>
        {data.status === "Approved" && (
          <div className="workspace-fields">
            <label>
              Approved by
              <input
                maxLength={200}
                value={data.approvedBy}
                onChange={(e) => update({ approvedBy: e.target.value })}
              />
            </label>
            <label>
              Approval date
              <input
                type="date"
                value={data.approvedDate}
                onChange={(e) => update({ approvedDate: e.target.value })}
              />
            </label>
          </div>
        )}
      </fieldset>
      <div className="workspace-results no-print">
        <article>
          <span>Additional costs</span>
          <strong>{usd(totals.cost)}</strong>
        </article>
        <article>
          <span>Proposed change price</span>
          <strong>{usd(totals.price)}</strong>
        </article>
        <article>
          <span>Estimated added profit</span>
          <strong>{usd(totals.profit)}</strong>
        </article>
      </div>
      <p className="workspace-notice no-print">
        {approved
          ? "Approval recorded by you. This tool does not verify signatures or obtain customer approval."
          : "This change is not recorded as approved. Agree on scope, price, and timing before proceeding; follow your contract’s approval process."}
      </p>
      <section className="change-document">
        <span className="eyebrow">
          CHANGE ORDER / {(data.status === "Approved" && !approved ? "Approval incomplete" : data.status).toUpperCase()}
        </span>
        <h2>{data.number || "Change order"}</h2>
        <p>
          <strong>Project:</strong> {data.job || "Not entered"}
          <br />
          <strong>Customer:</strong> {data.customer || "Not entered"}
          <br />
          <strong>Contractor:</strong> {data.contractor || "Not entered"}
          <br />
          <strong>Date:</strong> {data.date || "Not entered"}
        </p>
        <h3>Scope of change</h3>
        <p className="preserve-lines">
          {data.scope || "Enter the scope before sending this document."}
        </p>
        <h3>Schedule impact</h3>
        <p className="preserve-lines">
          {data.schedule || "Not specified — confirm before approval."}
        </p>
        <h3>Additional contract price: {usd(totals.price)}</h3>
        <p>
          This amount adds to the existing contract price. Taxes and fees are
          not added automatically; account for applicable charges before
          approval. The internal cost breakdown above is omitted from the
          printed document.
        </p>
        <p>
          <strong>Approval record:</strong>{" "}
          {approved
            ? `${data.approvedBy} — ${data.approvedDate} (recorded by contractor)`
            : "Not recorded"}
        </p>
        <div className="signature-lines">
          <p>
            Customer signature: ____________________
            <br />
            Date: ____________________
          </p>
          <p>
            Contractor signature: ____________________
            <br />
            Date: ____________________
          </p>
        </div>
        <small>
          This document records a proposed scope and price change. It is not an
          electronic signature service or a replacement for your contract’s
          terms.
        </small>
      </section>
    </div>
  );
}
