import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCompactCurrency, monthLabel } from "../utils/format.js";

export default function TrendChart({ data }) {
  if (!data || data.length === 0) return null;
  const chartData = data.map((d) => ({ ...d, monthLabel: monthLabel(d.month) }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#DCE0E8" vertical={false} />
        <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: "#5B6472" }} axisLine={{ stroke: "#DCE0E8" }} />
        <YAxis
          tick={{ fontSize: 11, fill: "#5B6472" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCompactCurrency(v)}
          width={56}
        />
        <Tooltip
          formatter={(value, name) => [formatCompactCurrency(value), name === "realized" ? "Realizado" : "Meta"]}
          labelStyle={{ color: "#10182A" }}
          contentStyle={{ borderRadius: 4, borderColor: "#DCE0E8", fontSize: 12 }}
        />
        <Line type="monotone" dataKey="target" stroke="#B9873A" strokeDasharray="4 3" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="realized" stroke="#7C1F3B" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
