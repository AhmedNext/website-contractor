"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { calculate, cashFlow, type Values } from "@/lib/engines";
import { validateField } from "@/lib/validation";
import { money, type Tool, type Field } from "@/content/tools";
const CashChart = dynamic(() => import("./cash-chart"), {
  ssr: false,
  loading: () => <div className="chart">Loading cash forecast…</div>,
});
function initial(tool: Tool): Record<string, string> {
  const values = Object.fromEntries(
    tool.fields.map((f) => [f.key, f.initial.toLocaleString("en-US")]),
  );
  for (let i = 0; i < 12; i++) {
    values[`invoice${i}`] = i < 4 ? "20000" : "0";
    values[`expense${i}`] = i < 4 ? "15000" : "0";
    values[`other${i}`] = "0";
  }
  return values;
}
export function Calculator({ tool }: { tool: Tool }) {
  const [raw, setRaw] = useState(() => initial(tool)),
    [mode, setMode] = useState("0"),
    [months, setMonths] = useState(6),
    [status, setStatus] = useState("Proposed");
  const cash = tool.slug === "contractor-cash-flow-calculator";
  const fields = [
    ...tool.fields,
    ...(cash
      ? Array.from({ length: months }, (_, i) => [
          { key: `invoice${i}`, label: `Month ${i + 1} invoices`, initial: 0 },
          {
            key: `expense${i}`,
            label: `Month ${i + 1} job expenses`,
            initial: 0,
          },
          {
            key: `other${i}`,
            label: `Month ${i + 1} other net cash flow`,
            initial: 0,
          },
        ]).flat()
      : []),
  ];
  const errors = Object.fromEntries(
    fields.map((f) => [f.key, validateField(f, raw[f.key])]),
  );
  if (
    tool.slug === "markup-vs-margin-calculator" &&
    mode === "1" &&
    Number(raw.rate) >= 100
  )
    errors.rate = "Margin must be less than 100%.";
  const invalid = Object.values(errors).some(Boolean);
  const v: Values = Object.fromEntries(
    Object.entries(raw).map(([k, n]) => [k, Number(n.replace(/,/g, ""))]),
  );
  v.mode = Number(mode);
  const forecast = !invalid && cash ? cashFlow(v, months) : null;
  const metrics = invalid ? [] : (forecast?.metrics ?? calculate(tool.slug, v));
  const reset = () => {
    setRaw(initial(tool));
    setMode("0");
    setMonths(6);
    setStatus("Proposed");
  };
  const field = (f: Field) => (
    <div className="field" key={f.key}>
      <div className="label-row">
        <Label htmlFor={f.key}>{f.label}</Label>
        {f.hint && (
          <Tooltip>
            <TooltipTrigger aria-label={`Explain ${f.label}`}>
              <Info size={15} />
            </TooltipTrigger>
            <TooltipContent className="max-w-72">{f.hint}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div
        className={
          "input-wrap " +
          (f.unit === "months" || f.unit === "hours" ? "unit-long" : "")
        }
      >
        <span>{f.unit ?? "$"}</span>
        <Input
          id={f.key}
          inputMode="decimal"
          value={raw[f.key]}
          onChange={(e) => setRaw({ ...raw, [f.key]: e.target.value })}
          onBlur={() => {
            if (!errors[f.key] && raw[f.key])
              setRaw((prev) => ({
                ...prev,
                [f.key]: Number(prev[f.key].replace(/,/g, "")).toLocaleString(
                  "en-US",
                  { maximumFractionDigits: 10 },
                ),
              }));
          }}
          aria-invalid={!!errors[f.key]}
          aria-describedby={errors[f.key] ? f.key + "-error" : undefined}
        />
      </div>
      {errors[f.key] && (
        <p id={f.key + "-error"} className="field-error">
          {errors[f.key]}
        </p>
      )}
    </div>
  );
  return (
    <>
      <div className="mobile-result" aria-live="polite">
        <span>{invalid ? "Review your inputs" : metrics[0]?.label}</span>
        <strong>
          {invalid
            ? "—"
            : metrics[0]?.value === null
              ? "Unavailable"
              : metrics[0]?.count
                ? metrics[0].value
                : money(metrics[0]?.value ?? 0)}
        </strong>
        <a href="#detailed-results">View breakdown ↓</a>
      </div>
      <div className="calculator-grid">
        <Card className="input-panel">
          <CardContent>
            <div className="panel-heading">
              <h2>Your numbers</h2>
              <Button
                variant="ghost"
                onClick={reset}
                aria-label="Reset to example"
              >
                <RotateCcw size={15} /> Reset
              </Button>
            </div>
            <p className="panel-note">
              Start with this hypothetical example. Replace it with your
              estimate.
            </p>
            {tool.slug === "markup-vs-margin-calculator" && (
              <Tabs value={mode} onValueChange={setMode}>
                <TabsList className="w-full mb-5">
                  <TabsTrigger value="0" className="flex-1">
                    Markup
                  </TabsTrigger>
                  <TabsTrigger value="1" className="flex-1">
                    Profit margin
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            {tool.slug === "change-order-profit-calculator" && (
              <div className="field">
                <Label htmlFor="approval">Change-order status</Label>
                <select
                  id="approval"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Proposed</option>
                  <option>Approved</option>
                </select>
                <p className="panel-note">
                  {status === "Proposed"
                    ? "Scenario only; not approved collectible revenue."
                    : "Include only the approved amount."}
                </p>
              </div>
            )}
            <div className="fields-grid">{tool.fields.map(field)}</div>
            {cash && (
              <>
                <div className="field">
                  <Label htmlFor="horizon">Forecast length</Label>
                  <select
                    id="horizon"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>
                <p className="panel-note">
                  Other net flow: positive for inflow, negative for outflow.
                  Project expenses and invoices remain nonnegative.
                </p>
                {Array.from({ length: months }, (_, i) => (
                  <fieldset className="month-fields" key={i}>
                    <legend>MONTH {i + 1}</legend>
                    {fields
                      .filter(
                        (f) =>
                          f.key === `invoice${i}` ||
                          f.key === `expense${i}` ||
                          f.key === `other${i}`,
                      )
                      .map(field)}
                  </fieldset>
                ))}
              </>
            )}
            {tool.slug === "labor-rate-calculator" &&
              (v.billable > v.paid || v.billable > 3000 || v.paid > 3000) && (
                <Alert>
                  <AlertDescription>
                    Review your hours: billable hours normally fit within paid
                    hours. Annual hours above 3,000 merit a capacity check.
                  </AlertDescription>
                </Alert>
              )}
          </CardContent>
        </Card>
        <div
          id="detailed-results"
          className="results-panel"
          aria-live="polite"
          aria-atomic="false"
        >
          <div className="results-heading">
            <span className="eyebrow">YOUR ESTIMATED OUTCOME</span>
            <span className="live-dot">Live calculation</span>
          </div>
          {invalid ? (
            <Alert variant="destructive">
              <AlertDescription>
                Check the highlighted inputs to calculate a valid estimate.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div
                className={
                  "primary-result " +
                  ((metrics[0]?.value ?? 0) < 0 ? "loss" : "")
                }
              >
                <span>{metrics[0]?.label}</span>
                <strong data-testid="primary-result">
                  {metrics[0]?.value === null
                    ? "Not achievable"
                    : metrics[0]?.count
                      ? metrics[0].value
                      : money(metrics[0]?.value ?? 0)}
                </strong>
                <p>
                  {cash
                    ? "Timing matters as much as profitability."
                    : tool.slug === "contractor-break-even-calculator"
                      ? "Whole jobs, rounded up to cover overhead."
                      : "Based on your inputs. Review the assumptions below."}
                </p>
              </div>
              {(metrics[0]?.value ?? 0) < 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {cash
                      ? "Cash falls below zero. Plan funding or adjust payment timing."
                      : "This scenario generates an estimated loss. Review pricing and costs."}
                  </AlertDescription>
                </Alert>
              )}
              {tool.slug === "contractor-break-even-calculator" &&
                v.revenue <= v.variable && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Contribution is zero or negative. More jobs cannot cover
                      positive overhead under these assumptions.
                    </AlertDescription>
                  </Alert>
                )}
              <div className="metrics-grid">
                {metrics.slice(1).map((m) => (
                  <div className="metric" key={m.label}>
                    <span>{m.label}</span>
                    <strong className={(m.value ?? 0) < 0 ? "negative" : ""}>
                      {m.value === null
                        ? "Unavailable"
                        : m.percent
                          ? m.value.toFixed(2) + "%"
                          : m.count
                            ? m.value.toLocaleString("en-US")
                            : money(m.value)}
                    </strong>
                  </div>
                ))}
              </div>
              {forecast && (
                <>
                  <CashChart rows={forecast.rows} />
                  <div
                    className="table-scroll"
                    tabIndex={0}
                    role="region"
                    aria-label="Monthly cash forecast"
                  >
                    <table>
                      <caption>Monthly cash forecast — USD</caption>
                      <thead>
                        <tr>
                          {[
                            "Month",
                            "Opening",
                            "Received",
                            "Paid",
                            "Net",
                            "Closing",
                            "Receivables",
                          ].map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {forecast.rows.map((r) => (
                          <tr key={r.month}>
                            <th scope="row">{r.month}</th>
                            {[
                              r.opening,
                              r.received,
                              r.paid,
                              r.net,
                              r.closing,
                              r.receivables,
                            ].map((n, i) => (
                              <td key={i}>{money(n)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="assumption-box">
                    <strong>Payment-delay sensitivity</strong>
                    <p>
                      With one additional month of delay, the funding gap
                      becomes{" "}
                      {money(
                        cashFlow(
                          { ...v, paymentDelay: v.paymentDelay + 1 },
                          months,
                        ).metrics[1].value ?? 0,
                      )}
                      .
                    </p>
                  </div>
                </>
              )}
              {tool.slug === "job-profit-calculator" && (
                <div className="cost-breakdown">
                  <h3>Where the contract dollars go</h3>
                  {[
                    ["Direct costs", metrics[3].value],
                    ["Overhead", v.overhead],
                    ["Contingency expense", v.contingency],
                    ["Estimated profit", metrics[0].value],
                  ].map(([label, n]) => (
                    <div key={String(label)}>
                      <span>{label}</span>
                      <div className="bar-track">
                        <i
                          style={{
                            width: `${Math.max(0, Math.min(100, (Number(n) / Math.max(1, Number(metrics[2].value))) * 100))}%`,
                          }}
                        />
                      </div>
                      <strong>{money(Number(n))}</strong>
                    </div>
                  ))}
                </div>
              )}
              <div className="assumption-box">
                <Info size={18} />
                <p>
                  Your financial inputs stay in this browser. Results are
                  planning estimates, not guaranteed outcomes or professional
                  advice.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
