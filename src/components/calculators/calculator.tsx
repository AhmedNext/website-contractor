"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, Info, Bookmark, Copy } from "lucide-react";
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
import { calculate, cashFlow, type Values, type Metric } from "@/lib/engines";
import { validateField } from "@/lib/validation";
import { money, type Tool, type Field } from "@/content/tools";
import {
  calculatorPresets,
  type CalculatorPreset,
} from "@/content/calculator-presets";
const CalculatorVisuals = dynamic(() => import("./calculator-visuals"), {
  ssr: false,
  loading: () => (
    <div className="visual-lab chart-loading">
      Preparing your interactive chart…
    </div>
  ),
});
function formatMetric(metric: Metric) {
  if (metric.value === null) return "Unavailable";
  if (metric.count) return metric.value.toLocaleString("en-US");
  if (metric.percent) return `${metric.value.toFixed(2)}%`;
  return money(metric.value);
}
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
export function Calculator({ tool, presets = calculatorPresets[tool.slug] ?? [] }: { tool: Tool; presets?: CalculatorPreset[] }) {
  const [raw, setRaw] = useState(() => initial(tool)),
    [mode, setMode] = useState("0"),
    [months, setMonths] = useState(6),
    [status, setStatus] = useState("Proposed");
  const [pinned, setPinned] = useState<Metric | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [visualRevision, setVisualRevision] = useState(0);
  const [presetName, setPresetName] = useState("Default example");
  const cash = tool.slug === "contractor-cash-flow-calculator";
  const fields: Field[] = [
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
    Number(raw.rate.replace(/,/g, "")) >= 100
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
    setPinned(null);
    setCopyStatus("");
    setPresetName("Default example");
    setVisualRevision((n) => n + 1);
  };
  const applyPreset = (preset: CalculatorPreset) => {
    setRaw({
      ...initial(tool),
      ...Object.fromEntries(
        Object.entries(preset.values).map(([key, value]) => [
          key,
          value.toLocaleString("en-US"),
        ]),
      ),
    });
    setMonths(6);
    setStatus("Proposed");
    setPresetName(preset.label);
    setCopyStatus("");
    setVisualRevision((n) => n + 1);
  };
  const copyEstimate = async () => {
    const text = [
      tool.name,
      "Planning estimate — USD",
      ...(tool.slug === "markup-vs-margin-calculator"
        ? [`Mode: ${mode === "0" ? "Markup" : "Profit margin"}`]
        : []),
      ...(tool.slug === "change-order-profit-calculator"
        ? [`Status: ${status}`]
        : []),
      ...(cash ? [`Forecast: ${months} months`] : []),
      "",
      ...fields.map(
        (f) =>
          `${f.label}: ${f.unit ? `${v[f.key]} ${f.unit}` : money(v[f.key])}`,
      ),
      "",
      ...metrics.map((metric) => `${metric.label}: ${formatMetric(metric)}`),
      "",
      "Based on entered assumptions. This summary excludes the separate what-if scenario.",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Estimate copied.");
    } catch {
      setCopyStatus(
        "Copy unavailable in this browser. You can select the result text instead.",
      );
    }
  };
  const rangeFor = (f: Field) => {
    if (errors[f.key]) return null;
    const n = v[f.key];
    if (f.key === "target" || (f.key === "rate" && mode === "1"))
      return { min: 0, max: Math.max(95, n), step: 0.5 };
    if (["rate", "burden", "retainage"].includes(f.key))
      return {
        min: 0,
        max: f.key === "retainage" ? 100 : Math.max(100, n),
        step: 1,
      };
    if (f.key === "paymentDelay")
      return { min: 0, max: Math.max(6, n), step: 1 };
    if (f.key === "billable")
      return { min: 100, max: Math.max(3000, n), step: 25 };
    return null;
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
          onChange={(e) => {
            setRaw({ ...raw, [f.key]: e.target.value });
            setPresetName("");
            setCopyStatus("");
          }}
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
      {rangeFor(f) && (
        <input
          className="field-slider"
          type="range"
          aria-label={`Adjust ${f.label}`}
          min={rangeFor(f)!.min}
          max={rangeFor(f)!.max}
          step={rangeFor(f)!.step}
          value={v[f.key]}
          onChange={(e) => {
            setRaw((prev) => ({ ...prev, [f.key]: e.target.value }));
            setPresetName("");
            setCopyStatus("");
          }}
        />
      )}
      {errors[f.key] && (
        <p id={f.key + "-error"} className="field-error">
          {errors[f.key]}
        </p>
      )}
    </div>
  );
  return (
    <>
      <div className="calculator-toolbar">
        <div className="example-presets">
          <span>TRY AN EXAMPLE</span>
          <button
            className={presetName === "Default example" ? "active" : ""}
            aria-pressed={presetName === "Default example"}
            onClick={reset}
          >
            Default example
          </button>
          {presets.map((preset) => (
            <button
              key={preset.label}
              className={presetName === preset.label ? "active" : ""}
              aria-pressed={presetName === preset.label}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <span className="preset-note">
          Hypothetical scenarios · Updates instantly
        </span>
      </div>
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
                  <details className="month-editor" key={i} open={i === 0}>
                    <summary>
                      Month {i + 1}
                      <span>{money(v[`invoice${i}`] || 0)} invoiced</span>
                    </summary>
                    <fieldset className="month-fields">
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
                  </details>
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
        <div id="detailed-results" className="results-panel">
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
              <div className="result-actions">
                <button onClick={() => setPinned({ ...metrics[0] })}>
                  <Bookmark size={15} /> Pin this estimate
                </button>
                <button onClick={copyEstimate}>
                  <Copy size={15} /> Copy estimate
                </button>
              </div>
              {copyStatus && (
                <p className="copy-status" role="status">
                  {copyStatus}
                </p>
              )}
              {pinned && (
                <div className="pinned-estimate">
                  <div>
                    <span>Pinned {pinned.label.toLowerCase()}</span>
                    <strong>{formatMetric(pinned)}</strong>
                  </div>
                  <div>
                    <span>Change from pinned estimate</span>
                    <strong>
                      {pinned.value === null || metrics[0].value === null
                        ? "Unavailable"
                        : `${metrics[0].value - pinned.value > 0 ? "+" : ""}${formatMetric({ ...metrics[0], value: metrics[0].value - pinned.value })}`}
                    </strong>
                  </div>
                  <button
                    onClick={() => setPinned(null)}
                    aria-label="Remove pinned estimate"
                  >
                    ×
                  </button>
                </div>
              )}
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
              <CalculatorVisuals
                key={`${tool.slug}-${mode}-${visualRevision}`}
                slug={tool.slug}
                values={v}
                months={months}
              />
              <div className="metrics-grid">
                {metrics.slice(1, 5).map((m) => (
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
              {metrics.length > 5 && (
                <details className="extra-metrics">
                  <summary>More details from your estimate</summary>
                  <div className="metrics-grid">
                    {metrics.slice(5).map((metric) => (
                      <div className="metric" key={metric.label}>
                        <span>{metric.label}</span>
                        <strong
                          className={(metric.value ?? 0) < 0 ? "negative" : ""}
                        >
                          {formatMetric(metric)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </details>
              )}
              {forecast && (
                <>
                  <details className="forecast-details">
                    <summary>View the monthly cash forecast</summary>
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
                  </details>
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
