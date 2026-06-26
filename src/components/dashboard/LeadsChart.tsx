"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LeadWithEngagement } from "@/lib/types";

function groupLeadsByDate(leads: LeadWithEngagement[]) {
  const map = new Map<string, number>();

  for (const lead of leads) {
    const d = new Date(lead.created_at);
    const key = d.toISOString().split("T")[0];
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      leads: count,
    }));
}

export default function LeadsChart({ leads }: { leads: LeadWithEngagement[] }) {
  const data = groupLeadsByDate(leads);

  if (data.length === 0) {
    return (
      <div className="glass-card flex h-64 items-center justify-center">
        <p className="text-sm text-zinc-500">No lead data to chart yet</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Leads Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#12121a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#f4f4f5",
            }}
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#leadGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
