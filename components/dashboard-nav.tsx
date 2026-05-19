"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Calendar, Settings, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function DashboardNav() {
  const path = usePathname();
  const links = [
    { href: "/dashboard", label: "Today", icon: Zap },
    { href: "/dashboard/archive", label: "Archive", icon: Calendar },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-black text-slate-900">omgskill<span className="text-indigo-600">.ai</span></span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${path === href ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-900"}`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/pricing" className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors">
          Upgrade
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
