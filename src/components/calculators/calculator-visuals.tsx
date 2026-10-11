"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calculate, cashFlow, type Values } from "@/lib/engines";
import { money } from "@/content/tools";

type Point = { label: string | number; current: number; scenario: number };
type ScenarioConfig = {
  label: string;
  min: number;
  max: number;
  step: number;
  start: number;
  unit: string;
  title: string;
  description: string;
  metric: string;
  baseline: number | null;
  build: (value: number) => { outcome: number | null; points: Point[] };
};
const compactMoney = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
const colors = { current: "#39634c", scenario: "#bf522e" };

function scenarioConfig(
  slug: string,
  v: Values,
  months: number,
): ScenarioConfig {
  const current = calculate(slug, v);
  if (slug === "job-profit-calculator")
    return {
      label: "Change every estimated cost",
      min: -20,
      max: 40,
      step: 1,
      start: 0,
      unit: "%",
      title: "How much room does your bid have?",
      description:
        "Compare your bid with higher or lower costs. Contract revenue stays the same.",
      metric: "Estimated job profit",
      baseline: current[0].value,
      build: (n: number) => {
        const next = { ...v };
        for (const key of [
          "materials",
          "labor",
          "subs",
          "equipment",
          "permits",
          "other",
          "overhead",
          "contingency",
        ])
          next[key] *= 1 + n / 100;
        const result = calculate(slug, next);
        return {
          outcome: result[0].value,
          points: [
            {
              label: "Revenue",
              current: current[2].value!,
              scenario: result[2].value!,
            },
            {
              label: "Total costs",
              current: current[5].value!,
              scenario: result[5].value!,
            },
            {
              label: "Profit",
              current: current[0].value!,
              scenario: result[0].value!,
            },
          ],
        };
      },
    };
  if (slug === "contractor-break-even-calculator") {
    const contribution = v.revenue - v.variable;
    const targetJobs = current[4].value;
    const end = Math.min(100, Math.max(10, (targetJobs ?? 5) * 2));
    return {
      label: "Jobs completed this month",
      min: 0,
      max: end,
      step: 1,
      start: Math.min(end, targetJobs ?? 3),
      unit: " jobs",
      title: "Find the point where the job volume pays off.",
      description:
        "Revenue crosses total costs at break-even. The chart shows up to 100 whole jobs.",
      metric: "Monthly operating profit",
      baseline: null,
      build: (n: number) => ({
        outcome: n * contribution - v.fixed,
        points: Array.from({ length: end + 1 }, (_, jobs) => ({
          label: jobs,
          current: jobs * v.revenue,
          scenario: v.fixed + jobs * v.variable,
        })),
      }),
    };
  }
  if (slug === "contractor-cash-flow-calculator") {
    const base = cashFlow(v, months);
    return {
      label: "Additional payment delay",
      min: 0,
      max: Math.min(6, 120 - v.paymentDelay),
      step: 1,
      start: 0,
      unit: " months",
      title: "See the cash gap before it happens.",
      description:
        "Compare monthly closing cash if customers take longer to pay. Billing and expenses stay the same.",
      metric: "Lowest projected cash balance",
      baseline: base.metrics[0].value,
      build: (n: number) => {
        const next = cashFlow(
          { ...v, paymentDelay: v.paymentDelay + n },
          months,
        );
        return {
          outcome: next.metrics[0].value,
          points: [
            { label: "Opening", current: v.opening, scenario: v.opening },
            ...base.rows.map((row, i) => ({
              label: `M${row.month}`,
              current: row.closing,
              scenario: next.rows[i].closing,
            })),
          ],
        };
      },
    };
  }
  if (slug === "labor-rate-calculator")
    return {
      label: "Change billable hours",
      min: -40,
      max: 20,
      step: 1,
      start: 0,
      unit: "%",
      title: "Less billable time changes your hourly rate.",
      description:
        "Annual costs stay the same. Adjust the hours that can actually earn revenue; check that they fit your paid hours.",
      metric: "Required hourly charge",
      baseline: current[0].value,
      build: (n: number) => {
        const next = calculate(slug, {
          ...v,
          billable: v.billable * (1 + n / 100),
        });
        return {
          outcome: next[0].value,
          points: [
            { label: "Hourly wage", current: v.wage, scenario: v.wage },
            {
              label: "Hourly cost",
              current: current[1].value!,
              scenario: next[1].value!,
            },
            {
              label: "Charge-out rate",
              current: current[0].value!,
              scenario: next[0].value!,
            },
          ],
        };
      },
    };
  if (slug === "markup-vs-margin-calculator")
    return {
      label: v.mode === 0 ? "Try a different markup" : "Try a different margin",
      min: 0,
      max:
        v.mode === 0 ? Math.max(100, Math.ceil(v.rate)) : Math.max(99, v.rate),
      step: 0.5,
      start: v.rate,
      unit: "%",
      title: "Same percentage. Different selling price.",
      description:
        "Both curves use your job cost. Margin uses selling price as its denominator; markup uses cost. The plot stops at 95% margin.",
      metric: "Required selling price",
      baseline: current[0].value,
      build: (n: number) => ({
        outcome: calculate(slug, { ...v, rate: n })[0].value,
        points: Array.from(
          {
            length:
              Math.min(19, Math.max(10, Math.ceil(Math.max(v.rate, n) / 5))) +
              1,
          },
          (_, i) => {
            const rate = i * 5;
            return {
              label: rate,
              current: calculate(slug, { ...v, rate, mode: 0 })[0].value!,
              scenario: calculate(slug, { ...v, rate, mode: 1 })[0].value!,
            };
          },
        ),
      }),
    };
  return {
    label: "Change all additional costs",
    min: -20,
    max: 40,
    step: 1,
    start: 0,
    unit: "%",
    title: "Does the extra scope earn its keep?",
    description:
      "Adjust direct costs, overhead, delay and contingency for the change. Original job costs and change revenue stay fixed.",
    metric: "Revised estimated profit",
    baseline: current[0].value,
    build: (n: number) => {
      const next = { ...v };
      for (const key of ["direct", "overhead", "delay", "contingency"])
        next[key] *= 1 + n / 100;
      const result = calculate(slug, next);
      return {
        outcome: result[0].value,
        points: [
          {
            label: "Original profit",
            current: current[2].value!,
            scenario: result[2].value!,
          },
          {
            label: "Added profit",
            current: current[6].value!,
            scenario: result[6].value!,
          },
          {
            label: "Revised profit",
            current: current[0].value!,
            scenario: result[0].value!,
          },
        ],
      };
    },
  };
}

export default function CalculatorVisuals({
  slug,
  values,
  months,
}: {
  slug: string;
  values: Values;
  months: number;
}) {
  const [adjustment, setAdjustment] = useState<number | null>(null);
  const config = scenarioConfig(slug, values, months);
  const value = Math.max(
    config.min,
    Math.min(config.max, adjustment ?? config.start),
  );
  const { points, outcome } = config.build(value);
  const difference =
    config.baseline === null || outcome === null
      ? null
      : outcome - config.baseline;
  const breakEven = slug === "contractor-break-even-calculator";
  const markup = slug === "markup-vs-margin-calculator";
  const cash = slug === "contractor-cash-flow-calculator";
  const line = cash || markup || breakEven;
  const labels = breakEven
    ? ["Revenue", "Total costs"]
    : markup
      ? ["Price with markup", "Price with margin"]
      : ["Your estimate", "What-if scenario"];
  const ref = breakEven ? value : markup && value <= 95 ? value : undefined;
  const breakEvenJobs = breakEven ? calculate(slug, values)[0].value : null;
  return (
    <section className="visual-lab" aria-labelledby="visual-lab-title">
      <div className="visual-lab-heading">
        <div>
          <span className="eyebrow">EXPLORE THE NUMBERS</span>
          <h3 id="visual-lab-title">{config.title}</h3>
        </div>
        <span className="visual-badge">Interactive</span>
      </div>
      <p className="visual-description">{config.description}</p>
      <div className="scenario-control">
        <div className="scenario-label">
          <label htmlFor="scenario-slider">{config.label}</label>
          <output htmlFor="scenario-slider">
            {value > 0 && config.start === 0 && !breakEven ? "+" : ""}
            {value.toLocaleString("en-US")}
            {config.unit}
          </output>
        </div>
        <input
          id="scenario-slider"
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => setAdjustment(Number(e.target.value))}
          aria-valuetext={`${value}${config.unit}`}
        />
        <div className="range-ends">
          <span>
            {config.min}
            {config.unit}
          </span>
          <button onClick={() => setAdjustment(null)}>Reset scenario</button>
          <span>
            {config.max}
            {config.unit}
          </span>
        </div>
      </div>
      <div className="scenario-outcome" aria-live="polite" aria-atomic="true">
        <div>
          <span>{config.metric}</span>
          <strong className={(outcome ?? 0) < 0 ? "negative" : ""}>
            {outcome === null ? "Unavailable" : money(outcome)}
          </strong>
        </div>
        {difference !== null && (
          <p>
            {difference > 0 ? "+" : difference < 0 ? "−" : ""}
            {money(Math.abs(difference))}
            <span>vs. your estimate</span>
          </p>
        )}
        {breakEven && (
          <p>
            {value.toLocaleString("en-US")}
            <span>jobs completed</span>
          </p>
        )}
      </div>
      <div className="interactive-chart" aria-label={config.title}>
        <ResponsiveContainer width="100%" height={280}>
          {line ? (
            <LineChart
              data={points}
              margin={{ top: 15, right: 15, bottom: 5, left: 0 }}
              accessibilityLayer
            >
              <CartesianGrid stroke="#e5e9e3" vertical={false} />
              <XAxis
                dataKey="label"
                type={breakEven || markup ? "number" : "category"}
                domain={breakEven || markup ? [0, "dataMax"] : undefined}
                tickFormatter={(n) => (markup ? `${n}%` : String(n))}
                minTickGap={20}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                width={65}
                tickFormatter={compactMoney}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(n) => money(Number(n))}
                labelFormatter={(n) =>
                  markup
                    ? `${n}% pricing rate`
                    : breakEven
                      ? `${n} jobs`
                      : String(n)
                }
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <ReferenceLine y={0} stroke="#af7463" strokeDasharray="4 4" />
              {ref !== undefined && (
                <ReferenceLine x={ref} stroke="#7d8b79" strokeDasharray="4 4" />
              )}
              {breakEvenJobs !== null && breakEvenJobs <= config.max && (
                <ReferenceLine
                  x={breakEvenJobs}
                  stroke={colors.current}
                  strokeDasharray="3 3"
                  label={{
                    value: "Break-even",
                    position: "insideTopRight",
                    fill: colors.current,
                    fontSize: 10,
                  }}
                />
              )}
              <Line
                type="linear"
                dataKey="current"
                name={labels[0]}
                stroke={colors.current}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
              <Line
                type="linear"
                dataKey="scenario"
                name={labels[1]}
                stroke={colors.scenario}
                strokeWidth={3}
                strokeDasharray={cash ? "5 4" : undefined}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <BarChart
              data={points}
              margin={{ top: 15, right: 10, bottom: 5, left: 0 }}
              accessibilityLayer
            >
              <CartesianGrid stroke="#e5e9e3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={0}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                width={65}
                tickFormatter={compactMoney}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(n) => money(Number(n))}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <ReferenceLine y={0} stroke="#af7463" />
              <Bar
                dataKey="current"
                name={labels[0]}
                fill={colors.current}
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
                isAnimationActive={false}
              />
              <Bar
                dataKey="scenario"
                name={labels[1]}
                fill={colors.scenario}
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
                isAnimationActive={false}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <details className="chart-data">
        <summary>View exact chart values</summary>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Chart values"
        >
          <table>
            <caption>Chart values — USD</caption>
            <thead>
              <tr>
                <th scope="col">
                  {markup
                    ? "Percentage"
                    : breakEven
                      ? "Jobs"
                      : cash
                        ? "Month"
                        : "Measure"}
                </th>
                <th scope="col">{labels[0]}</th>
                <th scope="col">{labels[1]}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point: Point) => (
                <tr key={point.label}>
                  <th scope="row">
                    {point.label}
                    {markup ? "%" : ""}
                  </th>
                  <td>{money(point.current)}</td>
                  <td>{money(point.scenario)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="scenario-footnote">
        Exploring a scenario does not change the inputs in your estimate.
        {markup && value > 95
          ? " Your selected rate is outside the plotted range; its exact price is shown above."
          : ""}
      </p>
    </section>
  );
}
