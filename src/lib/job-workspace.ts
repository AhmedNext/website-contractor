import { z } from "zod";
const money = z.number().finite().min(0).max(1e12);
export const categories = [
  "Materials",
  "Labor (including owner labor)",
  "Subcontractors",
  "Equipment",
  "Permits and fees",
  "Allocated overhead",
  "Other costs",
];
const cost = z.object({
  category: z.string().max(100),
  estimated: money,
  actual: money,
});
export const jobSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(200),
  revenue: money,
  actualRevenue: money,
  complete: z.boolean(),
  costs: z.array(cost).length(7),
});
export const jobsSchema = z
  .object({
    version: z.literal(1),
    jobs: z.array(jobSchema).min(1).max(100),
  })
  .refine(
    (value) =>
      new Set(value.jobs.map((job) => job.id)).size === value.jobs.length &&
      value.jobs.every((job) =>
        job.costs.every((cost, index) => cost.category === categories[index]),
      ),
    "Invalid job IDs or cost categories",
  );
export type Job = z.infer<typeof jobSchema>;
export const newJob = (): Job => ({
  id: crypto.randomUUID(),
  name: "Untitled job",
  revenue: 0,
  actualRevenue: 0,
  complete: false,
  costs: categories.map((category) => ({ category, estimated: 0, actual: 0 })),
});
export const changeSchema = z.object({
  version: z.literal(1),
  job: z.string().max(200),
  customer: z.string().max(200),
  contractor: z.string().max(200),
  number: z.string().max(100),
  date: z.string().max(30),
  scope: z.string().max(10000),
  schedule: z.string().max(2000),
  status: z.enum(["Draft", "Sent", "Approved", "Declined"]),
  approvedBy: z.string().max(200),
  approvedDate: z.string().max(30),
  costs: z
    .array(z.object({ label: z.string().max(100), amount: money }))
    .length(4),
  margin: z.number().finite().min(0).max(95),
});
export type Change = z.infer<typeof changeSchema>;
export const blankChange: Change = {
  version: 1,
  job: "",
  customer: "",
  contractor: "",
  number: "CO-001",
  date: "",
  scope: "",
  schedule: "",
  status: "Draft",
  approvedBy: "",
  approvedDate: "",
  costs: [
    "Added labor",
    "Added materials",
    "Subcontractors / equipment",
    "Overhead / delay costs",
  ].map((label) => ({ label, amount: 0 })),
  margin: 20,
};
export function summarizeJob(job: Job) {
  const estimatedCost = job.costs.reduce((s, c) => s + c.estimated, 0);
  const actualCost = job.costs.reduce((s, c) => s + c.actual, 0);
  return {
    estimatedCost,
    actualCost,
    estimatedProfit: job.revenue - estimatedCost,
    actualProfit: job.actualRevenue - actualCost,
    costVariance: actualCost - estimatedCost,
  };
}
export function priceChange(change: Change) {
  const cost = change.costs.reduce((s, c) => s + c.amount, 0);
  const price = cost / (1 - change.margin / 100);
  return { cost, price, profit: price - cost };
}
export const usd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
export function downloadFile(
  name: string,
  content: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const csvCell = (s: string | number) =>
  typeof s === "number"
    ? String(s)
    : '"' + (/^[=+@\-\t\r]/.test(s) ? "'" : "") + s.replaceAll('"', '""') + '"';
