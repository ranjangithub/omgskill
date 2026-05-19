"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, Calendar, FileSearch, Radar, Settings, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/dashboard", label: "Today", icon: Zap },
  { href: "/dashboard/archive", label: "Archive", icon: Calendar },
  { href: "/dashboard/resources", label: "Resources", icon: BookMarked },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: Radar },
  { href: "/dashboard/resume", label: "Resume", icon: FileSearch },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const path = usePathname();

  return (
    <>
      {/* ── Top bar (visible on all screens) ── */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 md:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 shadow-sm shadow-indigo-200">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900">
              omgskill<span className="text-indigo-600">.ai</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  path === href
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/pricing"
            className="hidden sm:flex rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            Upgrade
          </Link>
          <UserButton />
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 px-3 transition-colors no-select ${
                active ? "text-indigo-600" : "text-slate-400"
              }`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${active ? "bg-indigo-50" : ""}`}>
                <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
