"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { formatTime } from "@/lib/format";

const AUTO_REFRESH_MS = 30_000;

export default function DashboardRefresh() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRefreshing(true);
    try {
      router.refresh();
      setLastUpdatedLabel(formatTime(new Date()));
    } catch {
      // Router may not be ready yet during initial hydration
    }
    setTimeout(() => setRefreshing(false), 600);
  }, [router]);

  useEffect(() => {
    setLastUpdatedLabel(formatTime(new Date()));

    const interval = setInterval(refresh, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="flex items-center gap-3">
      {lastUpdatedLabel && (
        <span className="hidden text-xs text-zinc-600 sm:inline">
          Updated {lastUpdatedLabel}
        </span>
      )}
      <button
        type="button"
        onClick={refresh}
        disabled={refreshing}
        className="btn-interactive inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-violet-500/30 hover:bg-white/10 hover:text-white disabled:opacity-60"
      >
        <svg
          className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
