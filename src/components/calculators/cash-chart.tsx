"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { CashRow } from "@/lib/engines";
import { money } from "@/content/tools";
export default function CashChart({ rows }: { rows: CashRow[] }) {
  return (
    <div
      className="chart"
      role="img"
      aria-label="Projected closing cash by month; exact values appear in the forecast table"
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={rows}
          margin={{ top: 20, right: 15, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickFormatter={(n) => `M${n}`} />
          <YAxis width={70} tickFormatter={(n) => `$${n / 1000}k`} />
          <Tooltip formatter={(value) => money(Number(value))} />
          <ReferenceLine y={0} stroke="#a34031" />
          <Line
            type="linear"
            dataKey="closing"
            name="Closing cash"
            stroke="#cb542c"
            strokeWidth={3}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
