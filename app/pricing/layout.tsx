import { auth } from "@clerk/nextjs/server";
import { DashboardNav } from "@/components/dashboard-nav";
import { MarketingNav } from "@/components/marketing-nav";
import { Footer } from "@/components/footer";

export default async function PricingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (userId) {
    // Logged-in users get the full dashboard nav (no bottom padding since pricing scrolls freely)
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <DashboardNav />
        <div className="flex-1 pb-16 md:pb-0">{children}</div>
      </div>
    );
  }

  // Logged-out visitors get the marketing layout
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MarketingNav />
      {children}
      <Footer />
    </div>
  );
}
