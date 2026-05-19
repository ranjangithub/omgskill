import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 px-6 py-12 text-slate-400">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-4 mb-10">
          <div className="sm:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-black text-white">omgskill<span className="text-indigo-400">.ai</span></span>
            </div>
            <p className="text-sm leading-relaxed">Daily AI intelligence for enterprise practitioners. 10 signals, expert curation, personalized to you.</p>
            <p className="mt-2 text-xs">By <a href="https://rajeshranjan.vercel.app" className="text-indigo-400 hover:text-indigo-300">Rajesh Ranjan</a> — Enterprise AI Architect, 20+ years, 2 US Patents.</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Product</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/start" className="hover:text-white transition-colors">Get started</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-xs">
          © {new Date().getFullYear()} omgskill.ai · All rights reserved.
        </div>
      </div>
    </footer>
  );
}
