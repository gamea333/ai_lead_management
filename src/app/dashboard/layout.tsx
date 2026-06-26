import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />
      <main className="flex min-h-screen flex-1 flex-col lg:ml-0">
        {children}
      </main>
    </div>
  );
}
