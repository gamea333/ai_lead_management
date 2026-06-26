export default function DashboardLoading() {
  return (
    <div className="animate-fade-in flex-1 overflow-y-auto p-6 pt-16 lg:pt-6">
      <div className="mb-8 space-y-2">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-4 w-64 rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="skeleton mb-3 h-3 w-20 rounded" />
            <div className="skeleton h-8 w-16 rounded" />
          </div>
        ))}
      </div>

      <div className="glass-card mt-8 p-6">
        <div className="skeleton mb-4 h-4 w-32 rounded" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>

      <div className="mt-8">
        <div className="skeleton mb-4 h-5 w-24 rounded" />
        <div className="glass-card p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
