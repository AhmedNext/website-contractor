import { describe, it, expect } from "vitest";
import { calculate, cashFlow, type Values } from "../lib/engines";
import { tools } from "../content/tools";
import { validateField } from "../lib/validation";
const sample = (slug: string): Values =>
  Object.fromEntries(
    tools.find((t) => t.slug === slug)!.fields.map((f) => [f.key, f.initial]),
  );
const val = (slug: string, v: Values, label: string) =>
  calculate(slug, v).find((m) => m.label === label)!.value;
describe("job profit", () => {
  const s = "job-profit-calculator";
  it("accounts for overhead and expected contingency", () => {
    expect(val(s, sample(s), "Estimated job profit")).toBe(13500);
    expect(val(s, sample(s), "Price for target margin")).toBe(51875);
    expect(val(s, sample(s), "Gross profit before overhead")).toBe(20000);
  });
  it("handles zero revenue and loss", () => {
    const v = { ...sample(s), base: 0, changes: 0 };
    expect(val(s, v, "Estimated job profit")).toBe(-41500);
    expect(val(s, v, "Profit margin")).toBeNull();
  });
  it("handles zero costs and large values", () => {
    const v = Object.fromEntries(Object.keys(sample(s)).map((k) => [k, 0]));
    v.base = 1e12;
    v.target = 20;
    expect(val(s, v, "Estimated job profit")).toBe(1e12);
    expect(val(s, v, "Markup on total cost")).toBeNull();
  });
  it("does not divide by 100% target", () =>
    expect(
      val(s, { ...sample(s), target: 100 }, "Price for target margin"),
    ).toBeNull());
});
describe("break-even", () => {
  const s = "contractor-break-even-calculator";
  it("rounds required jobs upward", () => {
    expect(
      val(
        s,
        { fixed: 10001, revenue: 15000, variable: 10000, profit: 5000 },
        "Break-even jobs per month",
      ),
    ).toBe(3);
    expect(val(s, sample(s), "Jobs for target profit")).toBe(3);
  });
  it.each([15000, 16000])(
    "cannot cover overhead with nonpositive contribution %s",
    (variable) =>
      expect(
        val(s, { ...sample(s), variable }, "Break-even jobs per month"),
      ).toBeNull(),
  );
});
describe("labor", () => {
  const s = "labor-rate-calculator";
  it("uses billable hours and annual allowances", () => {
    expect(val(s, sample(s), "Total annual worker-related cost")).toBe(87976);
    expect(val(s, sample(s), "Recommended hourly charge-out rate")).toBeCloseTo(
      68.73125,
      8,
    );
  });
  it("handles zero billable hours", () =>
    expect(
      val(
        s,
        { ...sample(s), billable: 0 },
        "Recommended hourly charge-out rate",
      ),
    ).toBeNull());
});
describe("markup and margin", () => {
  const s = "markup-vs-margin-calculator";
  it("converts 25% markup to 20% margin", () => {
    const v = { cost: 10000, rate: 25, mode: 0 };
    expect(val(s, v, "Required selling price")).toBe(12500);
    expect(val(s, v, "Profit margin")).toBe(20);
  });
  it("converts 25% margin to 33.333% markup", () => {
    const v = { cost: 10000, rate: 25, mode: 1 };
    expect(val(s, v, "Required selling price")).toBeCloseTo(13333.333333);
    expect(val(s, v, "Markup on cost")).toBeCloseTo(33.333333);
  });
  it("returns unavailable for impossible target and zero ratios", () => {
    expect(
      val(s, { cost: 100, rate: 100, mode: 1 }, "Required selling price"),
    ).toBeNull();
    expect(val(s, { cost: 0, rate: 25, mode: 0 }, "Profit margin")).toBeNull();
  });
});
describe("change orders", () => {
  const s = "change-order-profit-calculator";
  it("includes delay, overhead, contingency and changed costs", () => {
    expect(val(s, sample(s), "Revised estimated profit")).toBe(11250);
    expect(val(s, sample(s), "Incremental profit or loss")).toBe(1250);
    expect(
      val(s, { ...sample(s), direct: 6000 }, "Incremental profit or loss"),
    ).toBe(-2250);
  });
});
describe("cash timing", () => {
  const v = {
    opening: 5000,
    paymentDelay: 1,
    retainage: 10,
    release: 7,
    advance: 0,
    invoice0: 20000,
    expense0: 12000,
  };
  it("defers regular payment and retainage beyond horizon", () => {
    const f = cashFlow(v, 6);
    expect(f.rows[0].closing).toBe(-7000);
    expect(f.rows[1].received).toBe(18000);
    expect(f.rows[5].receivables).toBe(2000);
    expect(f.metrics[1].value).toBe(7000);
    expect(f.metrics[4].value).toBe(2000);
  });
  it("releases retainage in configured month", () => {
    const f = cashFlow({ ...v, release: 3 }, 6);
    expect(f.rows[2].received).toBe(2000);
    expect(f.rows[2].receivables).toBe(0);
  });
  it("does not release before payment eligibility", () => {
    const f = cashFlow({ ...v, paymentDelay: 2, release: 1 }, 6);
    expect(f.rows[0].received).toBe(0);
    expect(f.rows[2].received).toBe(20000);
  });
  it("credits advance without duplicating revenue", () => {
    const f = cashFlow({ ...v, advance: 10000 }, 6);
    expect(f.rows[0].received).toBe(10000);
    expect(f.rows[1].received).toBe(9000);
    expect(f.metrics[4].value).toBe(1000);
    expect(f.metrics[3].value).toBe(8000);
  });
  it("tracks signed other cash flows", () =>
    expect(cashFlow({ ...v, other0: -1000 }, 6).rows[0].closing).toBe(-8000));
});
describe("validation", () => {
  const field = { key: "materials", label: "Materials", initial: 0 };
  it.each(["", "-5", "Infinity", "abc"])("rejects %s", (n) =>
    expect(validateField(field, n)).toBeTruthy(),
  );
  it("accepts grouped currency", () =>
    expect(validateField(field, "1,000.50")).toBeNull());
  it("rejects impossible target margins", () =>
    expect(validateField({ ...field, key: "target" }, "100")).toBeTruthy());
  it("rejects zero billable hours", () =>
    expect(validateField({ ...field, key: "billable" }, "0")).toBeTruthy());
});
