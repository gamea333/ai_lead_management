"use client";

import DashboardRefresh from "@/components/DashboardRefresh";
import LeadsChart from "@/components/dashboard/LeadsChart";
import LeadsTable from "@/components/dashboard/LeadsTable";
import StatCard from "@/components/dashboard/StatCard";
import type { DashboardStats, LeadWithEngagement } from "@/lib/types";

interface DashboardContentProps {
  stats: DashboardStats;
  leads: LeadWithEngagement[];
  error: string | null;
}

export default function DashboardContent({
  stats,
  leads,
  error,
}: DashboardContentProps) {
  return (
    <div className="animate-page-enter flex-1 overflow-y-auto">
      <div className="border-b border-white/10 px-6 py-5 pt-16 lg:pt-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Real-time lead tracking & email engagement
            </p>
          </div>
          <DashboardRefresh />
        </div>
      </div>

      <div className="space-y-8 p-6">
        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Leads" value={stats.totalLeads} />
          <StatCard label="Emails Sent" value={stats.totalEmailsSent} />
          <StatCard label="Emails Opened" value={stats.totalEmailsOpened} />
          <StatCard label="Open Rate" value={stats.openRate} suffix="%" />
          <StatCard label="Link Clicks" value={stats.totalLinkClicks} />
          <StatCard label="Click Rate" value={stats.clickRate} suffix="%" />
        </div>

        <LeadsChart leads={leads} />

        <div id="leads">
          <h2 className="mb-4 text-lg font-semibold text-white">All Leads</h2>
          <LeadsTable leads={leads} />
        </div>
      </div>
    </div>
  );
}
