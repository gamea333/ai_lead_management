import { createAdminClient } from "./supabase";
import type { DashboardStats, LeadWithEngagement } from "./types";

export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  leads: LeadWithEngagement[];
}> {
  const supabase = createAdminClient();

  const [leadsResult, eventsResult] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("email_events").select("*"),
  ]);

  if (leadsResult.error) throw leadsResult.error;
  if (eventsResult.error) throw eventsResult.error;

  const leads = leadsResult.data ?? [];
  const events = eventsResult.data ?? [];

  const eventsByLead = new Map<string, Set<string>>();
  for (const event of events) {
    if (!eventsByLead.has(event.lead_id)) {
      eventsByLead.set(event.lead_id, new Set());
    }
    eventsByLead.get(event.lead_id)!.add(event.event_type);
  }

  const totalLeads = leads.length;
  const totalEmailsSent = events.filter((e) => e.event_type === "sent").length;
  const totalEmailsOpened = events.filter(
    (e) => e.event_type === "opened"
  ).length;
  const totalLinkClicks = events.filter(
    (e) => e.event_type === "clicked"
  ).length;

  const uniqueLeadsWhoClicked = [...eventsByLead.values()].filter((types) =>
    types.has("clicked")
  ).length;

  const openRate =
    totalEmailsSent > 0
      ? Math.round((totalEmailsOpened / totalEmailsSent) * 100)
      : 0;
  const clickRate =
    totalEmailsSent > 0
      ? Math.round((uniqueLeadsWhoClicked / totalEmailsSent) * 100)
      : 0;

  const leadsWithEngagement: LeadWithEngagement[] = leads.map((lead) => {
    const leadEvents = eventsByLead.get(lead.id) ?? new Set();
    return {
      ...lead,
      email_opened: leadEvents.has("opened"),
      link_clicked: leadEvents.has("clicked"),
    };
  });

  return {
    stats: {
      totalLeads,
      totalEmailsSent,
      totalEmailsOpened,
      openRate,
      totalLinkClicks,
      clickRate,
    },
    leads: leadsWithEngagement,
  };
}
