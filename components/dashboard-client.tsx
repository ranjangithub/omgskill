"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Mic, Radio, Sparkles } from "lucide-react";
import type { BriefingRecord, SignalRecord, SubscriberProfile } from "@/lib/db/schema";
import type { PricingTier } from "@/lib/db/schema";

const CLASS_COLORS: Record<string, string> = {
  "Strategic Signal": "bg-indigo-100 text-indigo-700",
  "Emerging Trend": "bg-violet-100 text-violet-700",
  "Governance Alert": "bg-red-100 text-red-700",
  "Tactical Update": "bg-amber-100 text-amber-700",
  "Hype/Noise": "bg-slate-100 text-slate-400",
};

const TABS = [
  { id: "signals", label: "Signals" },
  { id: "quick-hits", label: "⚡ Quick Hits" },
  { id: "research", label: "🔬 Research" },
  { id: "governance", label: "🛡 Gov Watch" },
  { id: "drive-time", label: "🎙 Drive Time" },
] as const;
type TabId = (typeof TABS)[number]["id"];

interface Props {
  briefing: BriefingRecord;
  tier: string;
  today: string;
  profile: SubscriberProfile | null;
}

function PaywallOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl">
      <Lock className="mb-3 h-8 w-8 text-slate-400" />
      <p className="mb-1 text-sm font-bold text-slate-700">Signals 4–10 are Pro</p>
      <p className="mb-4 text-xs text-slate-400">Upgrade to unlock all 10 signals daily</p>
      <Link href="/pricing" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
        Upgrade to Pro — $9/mo →
      </Link>
    </div>
  );
}

function SignalView({ signal, isLocked }: { signal: SignalRecord; isLocked: boolean }) {
  const [expanded, setExpanded] = useState<string | null>("whatHappened");
  const fields: Array<{ key: keyof SignalRecord; label: string; tier?: PricingTier }> = [
    { key: "whatHappened", label: "What happened" },
    { key: "whyItMatters", label: "Why it matters" },
    { key: "sdlcImpact", label: "Enterprise SDLC impact" },
    { key: "governanceImpact", label: "Governance impact" },
    { key: "architectureImpact", label: "Architecture impact" },
    { key: "myTake", label: "My take" },
    { key: "hook", label: "LinkedIn hook", tier: "pro" },
  ];
  return (
    <div className={`relative ${isLocked ? "select-none" : ""}`}>
      {isLocked && <PaywallOverlay />}
      <div className={isLocked ? "blur-sm pointer-events-none" : ""}>
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${CLASS_COLORS[signal.classification] ?? "bg-slate-100 text-slate-500"}`}>
            {signal.classification}
          </span>
        </div>
        <h2 className="mb-5 text-xl font-black text-slate-900 leading-snug">{signal.title}</h2>
        <div className="space-y-2">
          {fields.map(({ key, label }) => {
            const value = signal[key] as string;
            if (!value) return null;
            return (
              <div key={key} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
                <button onClick={() => setExpanded(expanded === key ? null : key)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left">
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                  <span className="text-slate-400 text-sm">{expanded === key ? "−" : "+"}</span>
                </button>
                {expanded === key && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
                    {key === "hook" && (
                      <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-1">LinkedIn hook — ready to paste</p>
                        <p className="text-sm font-semibold text-slate-800 italic">&ldquo;{value}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DashboardClient({ briefing, tier, today, profile }: Props) {
  const [activeSignal, setActiveSignal] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("signals");

  const canFull = tier === "pro" || tier === "premium";
  const visibleCount = canFull ? briefing.signals.length : 3;

  const signal = briefing.signals[activeSignal] ?? null;
  const isLocked = activeSignal >= visibleCount;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="flex w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white overflow-y-auto">
        <div className="p-3">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {new Date(today).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </p>
          <div className="space-y-0.5">
            {briefing.signals.map((s, i) => {
              const locked = i >= visibleCount;
              return (
                <button key={s.number} onClick={() => { setActiveSignal(i); setActiveTab("signals"); }}
                  className={`w-full flex items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors ${activeTab === "signals" && activeSignal === i ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}>
                  <span className={`mt-0.5 flex-shrink-0 text-xs font-black ${activeTab === "signals" && activeSignal === i ? "text-indigo-600" : "text-slate-400"}`}>{s.number}.</span>
                  {locked
                    ? <span className="flex items-center gap-1 text-[11px] text-slate-300"><Lock className="h-3 w-3" /> Pro only</span>
                    : <span className="line-clamp-2 text-[11px] leading-tight">{s.title}</span>}
                </button>
              );
            })}
          </div>
        </div>
        {!canFull && (
          <div className="border-t border-slate-100 p-3 mt-auto">
            <div className="rounded-xl bg-indigo-600 p-3 text-center">
              <p className="text-xs font-bold text-white mb-1.5">Unlock all 10</p>
              <Link href="/pricing" className="block rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                Upgrade → $9/mo
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-5 py-2.5 overflow-x-auto flex-shrink-0">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
              {tab.label}
            </button>
          ))}
          {tier === "premium" && profile && (
            <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              <Sparkles className="h-3 w-3" /> Personalized
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">
            {activeTab === "signals" && signal && (
              <>
                {/* Nav */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Signal {signal.number} / {briefing.signals.length}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveSignal(Math.max(0, activeSignal - 1))} disabled={activeSignal === 0}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors">
                      <ArrowLeft className="h-3 w-3" /> Prev
                    </button>
                    <button onClick={() => setActiveSignal(Math.min(briefing.signals.length - 1, activeSignal + 1))} disabled={activeSignal === briefing.signals.length - 1}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors">
                      Next <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                {/* Dots */}
                <div className="mb-6 flex gap-1.5">
                  {briefing.signals.map((_, i) => (
                    <button key={i} onClick={() => setActiveSignal(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeSignal ? "w-6 bg-indigo-600" : i < visibleCount ? "w-1.5 bg-slate-300 hover:bg-slate-400" : "w-1.5 bg-slate-100"}`} />
                  ))}
                </div>
                <SignalView signal={signal} isLocked={isLocked} />
              </>
            )}

            {activeTab === "quick-hits" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">⚡ Quick Hits</h2>
                {!canFull ? (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 text-center">
                    <Lock className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                    <p className="mb-3 text-sm font-bold text-slate-700">Quick Hits unlocked with Pro</p>
                    <Link href="/pricing" className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                      Upgrade to Pro
                    </Link>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none text-sm">
                    {briefing.sections.quickHits.split("\n").map((line, i) => (
                      <p key={i} className="mb-3 text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "research" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">🔬 Research Watch</h2>
                {!canFull ? (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 text-center">
                    <Lock className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                    <p className="mb-3 text-sm font-bold text-slate-700">Research Watch unlocked with Pro</p>
                    <Link href="/pricing" className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                      Upgrade to Pro
                    </Link>
                  </div>
                ) : (
                  <div className="text-sm">
                    {briefing.sections.research.split("\n").map((line, i) => (
                      <p key={i} className="mb-3 text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "governance" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">🛡 Governance Watch</h2>
                {!canFull ? (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 text-center">
                    <Lock className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                    <p className="mb-3 text-sm font-bold text-slate-700">Governance Watch unlocked with Pro</p>
                    <Link href="/pricing" className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                      Upgrade to Pro
                    </Link>
                  </div>
                ) : (
                  <div className="text-sm">
                    {briefing.sections.governance.split("\n").map((line, i) => (
                      <p key={i} className="mb-3 text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "drive-time" && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                    <Radio className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Drive Time</h2>
                    <p className="text-xs text-slate-400">5-minute radio-style take — ready for your commute</p>
                  </div>
                </div>
                {!canFull ? (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 text-center">
                    <Mic className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                    <p className="mb-1 text-sm font-bold text-slate-700">Drive Time unlocked with Pro</p>
                    <p className="mb-4 text-xs text-slate-400">Get 1 Drive Time script daily. Premium gets 5.</p>
                    <Link href="/pricing" className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                      Upgrade to Pro
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-900 p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">On Air</span>
                    </div>
                    {briefing.sections.driveTime.split("\n").map((line, i) => (
                      <p key={i} className={`mb-3 leading-relaxed ${line.startsWith("**") ? "text-sm font-bold text-emerald-400" : "text-sm text-slate-300"}`}>
                        {line.replace(/\*\*/g, "")}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
