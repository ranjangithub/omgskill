"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Mic, Radio, Sparkles } from "lucide-react";
import type { BriefingRecord, SignalRecord, SubscriberProfile } from "@/lib/db/schema";
import { CONTENT_GOALS } from "@/lib/personas/taxonomy";

const CLASS_COLORS: Record<string, string> = {
  "Strategic Signal": "bg-indigo-100 text-indigo-700",
  "Emerging Trend":   "bg-violet-100 text-violet-700",
  "Governance Alert": "bg-red-100 text-red-700",
  "Tactical Update":  "bg-amber-100 text-amber-700",
  "Hype/Noise":       "bg-slate-100 text-slate-400",
};

// Goal id → signal field + label
const GOAL_FIELDS: Record<string, { key: keyof SignalRecord; label: string }> = {
  "create-content": { key: "contentAngle",    label: "Content angle" },
  "sell-better":    { key: "salesIntel",      label: "Sales intel" },
  "learn-faster":   { key: "explainer",       label: "Explainer" },
  "lead-decide":    { key: "executiveBrief",  label: "Executive brief" },
};

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

function SignalView({ signal, isLocked, contentGoals }: { signal: SignalRecord; isLocked: boolean; contentGoals: string[] }) {
  const [expanded, setExpanded] = useState<string | null>("whatHappened");

  const coreFields: Array<{ key: keyof SignalRecord; label: string }> = [
    { key: "whatHappened",  label: "What happened" },
    { key: "whyItMatters",  label: "Why it matters" },
    { key: "industryImpact", label: "Industry impact" },
    { key: "roleImpact",    label: "Your role impact" },
    { key: "myTake",        label: "My take" },
    { key: "hook",          label: "LinkedIn hook — ready to paste" },
  ];

  // Add goal-specific fields based on the user's selected content goals
  const goalFields = contentGoals
    .filter((g) => g !== "stay-updated" && GOAL_FIELDS[g])
    .map((g) => ({ ...GOAL_FIELDS[g], goalEmoji: CONTENT_GOALS.find((cg) => cg.id === g)?.emoji ?? "" }));

  const allFields = [...coreFields, ...goalFields.map(({ key, label }) => ({ key, label }))];

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
          {allFields.map(({ key, label }) => {
            const value = signal[key] as string | undefined;
            if (!value) return null;
            const isGoalField = goalFields.some((g) => g.key === key);
            return (
              <div key={key} className={`overflow-hidden rounded-xl border ${isGoalField ? "border-indigo-100 bg-indigo-50/50" : "border-slate-100 bg-white"}`}>
                <button onClick={() => setExpanded(expanded === key ? null : key)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left">
                  <span className={`text-sm font-bold ${isGoalField ? "text-indigo-700" : "text-slate-700"}`}>{label}</span>
                  <span className="text-slate-400 text-sm">{expanded === key ? "−" : "+"}</span>
                </button>
                {expanded === key && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    {key === "hook" ? (
                      <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-1">Ready to paste</p>
                        <p className="text-sm font-semibold text-slate-800 italic">&ldquo;{value}&rdquo;</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600 leading-relaxed">{value}</p>
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

// Build tab list dynamically from the user's content goals
function buildTabs(contentGoals: string[]) {
  const tabs: Array<{ id: string; label: string }> = [
    { id: "signals", label: "📡 Signals" },
  ];
  const goalMeta: Record<string, string> = {
    "stay-updated":   "⚡ Quick Hits",
    "create-content": "✍️ Content",
    "sell-better":    "🤝 Sales Intel",
    "learn-faster":   "🧠 Learn",
    "lead-decide":    "🎯 Strategy",
  };
  for (const g of contentGoals) {
    if (goalMeta[g]) tabs.push({ id: g, label: goalMeta[g] });
  }
  tabs.push({ id: "drive-time", label: "🎙 Drive Time" });
  return tabs;
}

export function DashboardClient({ briefing, tier, today, profile }: Props) {
  const [activeSignal, setActiveSignal] = useState(0);
  const contentGoals = profile?.contentGoals ?? ["stay-updated"];
  const TABS = buildTabs(contentGoals);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const canFull = tier === "pro" || tier === "premium";
  const visibleCount = canFull ? briefing.signals.length : 3;

  const signal = briefing.signals[activeSignal] ?? null;
  const isLocked = activeSignal >= visibleCount;

  function SectionPaywall({ goal }: { goal: string }) {
    const meta = CONTENT_GOALS.find((g) => g.id === goal);
    return (
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 text-center">
        <Lock className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
        <p className="mb-3 text-sm font-bold text-slate-700">{meta?.label ?? "This section"} unlocked with Pro</p>
        <Link href="/pricing" className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
          Upgrade to Pro
        </Link>
      </div>
    );
  }

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

            {/* Signals tab */}
            {activeTab === "signals" && signal && (
              <>
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
                <div className="mb-6 flex gap-1.5">
                  {briefing.signals.map((_, i) => (
                    <button key={i} onClick={() => setActiveSignal(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeSignal ? "w-6 bg-indigo-600" : i < visibleCount ? "w-1.5 bg-slate-300 hover:bg-slate-400" : "w-1.5 bg-slate-100"}`} />
                  ))}
                </div>
                <SignalView signal={signal} isLocked={isLocked} contentGoals={contentGoals} />
              </>
            )}

            {/* Quick Hits (stay-updated) */}
            {activeTab === "stay-updated" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">⚡ Quick Hits</h2>
                {!canFull ? <SectionPaywall goal="stay-updated" /> : (
                  <div className="prose prose-slate max-w-none text-sm">
                    {briefing.sections.quickHits.split("\n").map((line, i) => (
                      <p key={i} className="mb-3 text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content (create-content) */}
            {activeTab === "create-content" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">✍️ Content Ideas</h2>
                {!canFull ? <SectionPaywall goal="create-content" /> : (
                  <div className="text-sm space-y-3">
                    {briefing.sections.contentIdeas.split("\n").map((line, i) => (
                      <p key={i} className="text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sales Intel (sell-better) */}
            {activeTab === "sell-better" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">🤝 Sales Intel</h2>
                {!canFull ? <SectionPaywall goal="sell-better" /> : (
                  <div className="text-sm space-y-3">
                    {briefing.sections.salesIntel.split("\n").map((line, i) => (
                      <p key={i} className="text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Learn (learn-faster) */}
            {activeTab === "learn-faster" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">🧠 Explainers</h2>
                {!canFull ? <SectionPaywall goal="learn-faster" /> : (
                  <div className="text-sm space-y-3">
                    {briefing.sections.explainers.split("\n").map((line, i) => (
                      <p key={i} className="text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Strategy (lead-decide) */}
            {activeTab === "lead-decide" && (
              <div>
                <h2 className="mb-4 text-xl font-black text-slate-900">🎯 Strategy Brief</h2>
                {!canFull ? <SectionPaywall goal="lead-decide" /> : (
                  <div className="text-sm space-y-3">
                    {briefing.sections.strategyBrief.split("\n").map((line, i) => (
                      <p key={i} className="text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Drive Time */}
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
                    <p className="mb-4 text-xs text-slate-400">Get a daily 5-min script tailored to your industry and role.</p>
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
