import type { Values } from "@/lib/engines";

export type CalculatorPreset = { label: string; values: Values };

export const calculatorPresets: Record<string, CalculatorPreset[]> = {
  "job-profit-calculator": [
    {
      label: "Small remodel",
      values: {
        base: 18000,
        changes: 0,
        materials: 6000,
        labor: 4500,
        subs: 1000,
        equipment: 300,
        permits: 200,
        other: 200,
        overhead: 1500,
        contingency: 600,
        target: 20,
      },
    },
    {
      label: "Tight bid",
      values: {
        base: 42000,
        changes: 0,
        materials: 17000,
        labor: 14000,
        subs: 3500,
        equipment: 1200,
        permits: 500,
        other: 800,
        overhead: 4500,
        contingency: 1800,
        target: 20,
      },
    },
  ],
  "contractor-break-even-calculator": [
    {
      label: "Solo contractor",
      values: { fixed: 3500, revenue: 6000, variable: 3500, profit: 4000 },
    },
    {
      label: "Growing crew",
      values: { fixed: 18000, revenue: 24000, variable: 18000, profit: 12000 },
    },
  ],
  "contractor-cash-flow-calculator": [
    {
      label: "Slow payments",
      values: {
        opening: 5000,
        paymentDelay: 2,
        retainage: 10,
        release: 7,
        advance: 0,
      },
    },
    {
      label: "Customer advance",
      values: {
        opening: 5000,
        paymentDelay: 1,
        retainage: 10,
        release: 7,
        advance: 15000,
      },
    },
  ],
  "labor-rate-calculator": [
    { label: "More downtime", values: { billable: 1200 } },
    { label: "Higher utilization", values: { billable: 1800 } },
  ],
  "markup-vs-margin-calculator": [
    { label: "20% rate", values: { rate: 20 } },
    { label: "35% rate", values: { rate: 35 } },
  ],
  "change-order-profit-calculator": [
    {
      label: "Simple addition",
      values: {
        changes: 4000,
        direct: 2000,
        overhead: 300,
        delay: 0,
        contingency: 200,
      },
    },
    {
      label: "Schedule impact",
      values: {
        changes: 5000,
        direct: 3000,
        overhead: 700,
        delay: 1800,
        contingency: 500,
      },
    },
  ],
};
