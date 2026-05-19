import { DashboardNav } from "@/components/dashboard-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <DashboardNav />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
