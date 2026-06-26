import { getDashboardData } from "@/lib/dashboard";
import DashboardContent from "@/components/dashboard/DashboardContent";
import type { DashboardStats, LeadWithEngagement } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let stats: DashboardStats;
  let leads: LeadWithEngagement[];
  let error: string | null = null;

  try {
    const data = await getDashboardData();
    stats = data.stats;
    leads = data.leads;
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : "Failed to load dashboard data. Check your Supabase configuration.";
    stats = {
      totalLeads: 0,
      totalEmailsSent: 0,
      totalEmailsOpened: 0,
      openRate: 0,
      totalLinkClicks: 0,
      clickRate: 0,
    };
    leads = [];
  }

  return <DashboardContent stats={stats} leads={leads} error={error} />;
}
