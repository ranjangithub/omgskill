import { DashboardNav } from "@/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] flex-col bg-slate-50">
      <DashboardNav />
      {/* Account for mobile bottom nav (56px) */}
      <div className="flex flex-1 overflow-hidden pb-14 md:pb-0">
        {children}
      </div>
    </div>
  );
}
