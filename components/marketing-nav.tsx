"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

export function MarketingNav() {
  const path = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-black text-slate-900">omgskill<span className="text-indigo-600">.ai</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/pricing", label: "Pricing" },
            { href: "https://rajeshranjan.vercel.app/daily", label: "Sample" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${path === href ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900"}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign in</Link>
              <Link href="/sign-up" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
