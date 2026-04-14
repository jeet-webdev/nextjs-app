"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewStatItem = {
  label: string;
  value: number;
  color: string;
};

type OverviewStatsChartProps = {
  items: OverviewStatItem[];
};

export default function OverviewStatsChart({ items }: OverviewStatsChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      setIsLightTheme(root.classList.contains("light"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        name: item.label,
        value: item.value,
        color: item.color,
      })),
    [items],
  );

  const axisTickColor = isLightTheme ? "#334155" : "#cbd5e1";
  const gridColor = isLightTheme ? "#cbd5e1" : "#374151";
  const tooltipBackground = isLightTheme ? "#f8fafc" : "#0b1220";
  const tooltipBorder = isLightTheme ? "#cbd5e1" : "#334155";
  const tooltipText = isLightTheme ? "#0f172a" : "#f8fafc";

  return (
    <section className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Overview Chart</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              chartType === "bar"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Bar
          </button>
          <button
            type="button"
            onClick={() => setChartType("pie")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              chartType === "pie"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      <div className="h-[360px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
          {chartType === "bar" ? (
            <BarChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisTickColor, fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: axisTickColor, fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "rgba(99, 102, 241, 0.12)" }}
                contentStyle={{
                  background: tooltipBackground,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "10px",
                  color: tooltipText,
                }}
              />
              <Legend wrapperStyle={{ color: axisTickColor }} />
              <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: tooltipBackground,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "10px",
                  color: tooltipText,
                }}
              />
              <Legend wrapperStyle={{ color: axisTickColor }} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
