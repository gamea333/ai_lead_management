import Link from "next/link";
import type { LeadWithEngagement } from "@/lib/types";

function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority) return <span className="text-zinc-600">—</span>;

  const colors =
    priority === "High"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : priority === "Medium"
        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {priority}
    </span>
  );
}

function EngagementBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        active
          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
          : "border-white/10 bg-white/5 text-zinc-500"
      }`}
    >
      {active ? "Yes" : "No"}
    </span>
  );
}

export default function LeadsTable({ leads }: { leads: LeadWithEngagement[] }) {
  if (leads.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-zinc-500">
          No leads yet. Submit one from the{" "}
          <Link href="/" className="text-violet-400 hover:text-violet-300">
            lead form
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              {["Name", "Email", "Company", "Requirement", "AI Category", "AI Priority", "Submitted", "Opened", "Clicked"].map(
                (h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="transition-colors hover:bg-violet-500/5"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-white">
                  {lead.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                  {lead.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                  {lead.company || "—"}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3.5 text-zinc-400">
                  {lead.requirement}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                  {lead.ai_category || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <PriorityBadge priority={lead.ai_priority} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-zinc-500">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <EngagementBadge active={lead.email_opened} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <EngagementBadge active={lead.link_clicked} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
