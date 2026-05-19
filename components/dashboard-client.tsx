"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, Copy, Lock, Radio, Sparkles, Zap } from "lucide-react";
import type { BriefingRecord, SignalRecord, SubscriberProfile } from "@/lib/db/schema";
import { CONTENT_GOALS, INDUSTRIES } from "@/lib/personas/taxonomy";

// ── Classification badge colors ──────────────────────────────────────────────

const CLASS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Strategic Signal": { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
  "Emerging Trend":   { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500"  },
  "Governance Alert": { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500"     },
  "Tactical Update":  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  "Hype/Noise":       { bg: "bg-slate-100",  text: "text-slate-400",   dot: "bg-slate-300"   },
};

// ── Goal-specific signal fields ───────────────────────────────────────────────

const GOAL_FIELDS: Record<string, { key: keyof SignalRecord; label: string; emoji: string }> = {
  "create-content": { key: "contentAngle",   label: "Content angle",   emoji: "✍️" },
  "sell-better":    { key: "salesIntel",     label: "Sales intel",     emoji: "🤝" },
  "learn-faster":   { key: "explainer",      label: "Explainer",       emoji: "🧠" },
  "lead-decide":    { key: "executiveBrief", label: "Executive brief", emoji: "🎯" },
};

// ── Tab config ────────────────────────────────────────────────────────────────

function buildTabs(contentGoals: string[]) {
  const tabs: Array<{ id: string; label: string; emoji: string }> = [
    { id: "signals", label: "Signals", emoji: "📡" },
  ];
  const goalMeta: Record<string, { label: string; emoji: string }> = {
    "stay-updated":   { label: "Quick Hits", emoji: "⚡" },
    "create-content": { label: "Content",    emoji: "✍️" },
    "sell-better":    { label: "Sales",      emoji: "🤝" },
    "learn-faster":   { label: "Learn",      emoji: "🧠" },
    "lead-decide":    { label: "Strategy",   emoji: "🎯" },
  };
  for (const g of contentGoals) {
    const m = goalMeta[g];
    if (m) tabs.push({ id: g, ...m });
  }
  tabs.push({ id: "drive-time", label: "Drive Time", emoji: "🎙" });
  tabs.push({ id: "social-posts", label: "Social", emoji: "📱" });
  return tabs;
}

// ── Paywall ───────────────────────────────────────────────────────────────────

function PaywallCard({ goal }: { goal?: string }) {
  const meta = goal ? CONTENT_GOALS.find((g) => g.id === goal) : null;
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
        <Lock className="h-5 w-5 text-indigo-500" />
      </div>
      <p className="mb-1 text-base font-black text-slate-900">
        {meta ? `${meta.emoji} ${meta.label}` : "Pro Feature"}
      </p>
      <p className="mb-5 text-sm text-slate-500">
        {meta ? meta.delivers : "Upgrade to Pro to unlock all signals and sections"}
      </p>
      <Link href="/pricing"
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
        Upgrade to Pro — $9/mo
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ── Signal view ───────────────────────────────────────────────────────────────

function SignalCard({ signal, isLocked, contentGoals }: { signal: SignalRecord; isLocked: boolean; contentGoals: string[] }) {
  const [expanded, setExpanded] = useState<string | null>("whatHappened");

  const coreFields: Array<{ key: keyof SignalRecord; label: string }> = [
    { key: "whatHappened",   label: "What happened"       },
    { key: "whyItMatters",   label: "Why it matters"      },
    { key: "industryImpact", label: "Industry impact"     },
    { key: "roleImpact",     label: "Your role impact"    },
    { key: "myTake",         label: "Expert take"         },
    { key: "hook",           label: "LinkedIn hook — paste ready" },
  ];

  const goalFields = contentGoals
    .filter((g) => g !== "stay-updated" && GOAL_FIELDS[g])
    .map((g) => GOAL_FIELDS[g]);

  const allFields = [...coreFields, ...goalFields];
  const colors = CLASS_COLORS[signal.classification] ?? CLASS_COLORS["Hype/Noise"];

  if (isLocked) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <PaywallCard />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Signal header */}
      <div className="p-5 pb-4">
        <div className="mb-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${colors.bg} ${colors.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            {signal.classification}
          </span>
        </div>
        <h2 className="text-lg font-black leading-snug text-slate-900 md:text-xl">
          {signal.title}
        </h2>
      </div>

      {/* Accordion fields */}
      <div className="border-t border-slate-100 divide-y divide-slate-100">
        {allFields.map(({ key, label }) => {
          const value = signal[key] as string | undefined;
          if (!value) return null;
          const isGoalField = goalFields.some((g) => g.key === key);
          const isOpen = expanded === key;

          return (
            <div key={key} className={isGoalField ? "bg-indigo-50/40" : ""}>
              <button
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left active:bg-slate-50 transition-colors">
                <span className={`text-sm font-semibold ${isGoalField ? "text-indigo-700" : "text-slate-700"}`}>
                  {isGoalField && goalFields.find((g) => g.key === key)?.emoji
                    ? `${goalFields.find((g) => g.key === key)!.emoji} ${label}`
                    : label}
                </span>
                {isOpen
                  ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  : <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />}
              </button>

              {isOpen && (
                <div className={`px-5 pb-5 pt-1 ${isGoalField ? "bg-indigo-50/40" : ""}`}>
                  {key === "hook" ? (
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                        Copy & paste
                      </p>
                      <p className="text-sm font-semibold italic leading-relaxed text-slate-800">
                        &ldquo;{value}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-600">{value}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section renderer ──────────────────────────────────────────────────────────

function SectionContent({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {text.split("\n").filter(Boolean).map((line, i) => {
        const isBold = line.startsWith("**");
        const clean = line.replace(/\*\*/g, "");
        return (
          <p key={i} className={`text-sm leading-relaxed ${isBold ? "font-semibold text-slate-900" : "text-slate-600"}`}>
            {clean}
          </p>
        );
      })}
    </div>
  );
}

interface Props {
  briefing: BriefingRecord;
  tier: string;
  today: string;
  profile: SubscriberProfile | null;
  socialPostsRaw: string | null;
}

// ── Social posts ──────────────────────────────────────────────────────────────

function parseSocialSections(raw: string) {
  const headers = ["LinkedIn Post", "Twitter/X Thread", "LinkedIn Short Post", "Newsletter Teaser"];
  return headers.map((h) => {
    const start = raw.indexOf(`## ${h}`);
    if (start === -1) return { header: h, body: "", emoji: "" };
    const rest = raw.slice(start + `## ${h}`.length);
    const next = rest.search(/\n## /);
    const body = (next === -1 ? rest : rest.slice(0, next)).trim();
    const emoji = h.startsWith("LinkedIn P") ? "💼" : h.startsWith("Twitter") ? "🐦" : h.startsWith("LinkedIn S") ? "📸" : "✉️";
    return { header: h, body, emoji };
  }).filter((s) => s.body);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }}
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ── Main dashboard component ─────────────────────────────────────────────────

export function DashboardClient({ briefing, tier, today, profile, socialPostsRaw }: Props) {
  const [activeSignal, setActiveSignal] = useState(0);
  const contentGoals = profile?.contentGoals ?? ["stay-updated"];
  const TABS = buildTabs(contentGoals);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [activePlatform, setActivePlatform] = useState(0);

  const canFull = tier === "pro" || tier === "premium";
  const visibleCount = canFull ? briefing.signals.length : 3;
  const signal = briefing.signals[activeSignal] ?? null;
  const isLocked = activeSignal >= visibleCount;

  const industryLabel = profile?.industry
    ? (INDUSTRIES.find((i) => i.id === profile.industry)?.emoji ?? "") + " " +
      (INDUSTRIES.find((i) => i.id === profile.industry)?.label ?? "")
    : null;

  const dateLabel = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="flex w-full flex-1 overflow-hidden">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col border-r border-slate-200 bg-white overflow-y-auto">
        <div className="p-4">
          {/* Date + industry */}
          <div className="mb-4 px-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{dateLabel}</p>
            {industryLabel && (
              <p className="mt-0.5 text-xs font-semibold text-slate-500">{industryLabel}</p>
            )}
          </div>

          {/* Signal list */}
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-300">Today&apos;s signals</p>
          <div className="space-y-0.5">
            {briefing.signals.map((s, i) => {
              const locked = i >= visibleCount;
              const active = activeTab === "signals" && activeSignal === i;
              return (
                <button
                  key={s.number}
                  onClick={() => { setActiveSignal(i); setActiveTab("signals"); }}
                  className={`w-full flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all ${
                    active ? "bg-indigo-50 shadow-sm" : "hover:bg-slate-50"
                  }`}>
                  <span className={`mt-0.5 flex-shrink-0 text-xs font-black w-4 text-right ${
                    active ? "text-indigo-600" : "text-slate-300"
                  }`}>{s.number}</span>
                  {locked ? (
                    <span className="flex items-center gap-1 text-[11px] text-slate-300">
                      <Lock className="h-3 w-3" />
                      <span>Pro only</span>
                    </span>
                  ) : (
                    <span className={`line-clamp-2 text-[11px] leading-tight ${active ? "font-semibold text-indigo-800" : "text-slate-500"}`}>
                      {s.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upgrade nudge */}
        {!canFull && (
          <div className="mt-auto border-t border-slate-100 p-4">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-center shadow-md shadow-indigo-200">
              <Zap className="mx-auto mb-2 h-5 w-5 text-white/80" />
              <p className="text-xs font-bold text-white mb-0.5">Unlock all 10 signals</p>
              <p className="text-[10px] text-indigo-200 mb-3">+ Drive Time, Sales Intel & more</p>
              <Link href="/pricing"
                className="block rounded-xl bg-white px-3 py-2 text-xs font-black text-indigo-700 hover:bg-indigo-50 active:scale-95 transition-all">
                Upgrade — $9/mo →
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main panel ── */}
      <main className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Tab strip */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all no-select ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-100 active:bg-slate-100"
                }`}>
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            {tier === "premium" && (
              <span className="ml-auto flex flex-shrink-0 items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Sparkles className="h-3 w-3" /> AI Personalized
              </span>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 py-5 md:px-6 md:py-7">

            {/* ── Signals tab ── */}
            {activeTab === "signals" && signal && (
              <div>
                {/* Signal progress dots + nav */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {briefing.signals.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSignal(i)}
                        className={`rounded-full transition-all no-select ${
                          i === activeSignal
                            ? "w-6 h-2 bg-indigo-600"
                            : i < visibleCount
                            ? "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                            : "w-2 h-2 bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      {activeSignal + 1} / {briefing.signals.length}
                    </span>
                    <button
                      onClick={() => setActiveSignal(Math.max(0, activeSignal - 1))}
                      disabled={activeSignal === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 active:scale-95 transition-all no-select">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveSignal(Math.min(briefing.signals.length - 1, activeSignal + 1))}
                      disabled={activeSignal === briefing.signals.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 active:scale-95 transition-all no-select">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mobile signal list (thumbnail strip) */}
                <div className="mb-4 flex gap-2 overflow-x-auto md:hidden pb-1" style={{ scrollbarWidth: "none" }}>
                  {briefing.signals.slice(0, visibleCount).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSignal(i)}
                      className={`flex-shrink-0 rounded-xl border px-3 py-2 text-left transition-all no-select ${
                        i === activeSignal
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-slate-200 bg-white"
                      }`}
                      style={{ maxWidth: 140 }}>
                      <p className={`text-[10px] font-black mb-0.5 ${i === activeSignal ? "text-indigo-600" : "text-slate-400"}`}>
                        #{s.number}
                      </p>
                      <p className="line-clamp-2 text-[11px] leading-tight text-slate-600">{s.title}</p>
                    </button>
                  ))}
                  {!canFull && briefing.signals.slice(visibleCount).map((s, i) => (
                    <button key={i + visibleCount}
                      className="flex-shrink-0 flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 no-select"
                      style={{ maxWidth: 140 }}>
                      <Lock className="h-3 w-3 text-slate-300" />
                      <span className="text-[11px] text-slate-300">Pro only</span>
                    </button>
                  ))}
                </div>

                <SignalCard signal={signal} isLocked={isLocked} contentGoals={contentGoals} />
              </div>
            )}

            {/* ── Summary tab ── */}
            {activeTab === "stay-updated" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-900">⚡ Quick Hits</h2>
                  <p className="mt-1 text-xs text-slate-400">Fast signals — no analysis needed</p>
                </div>
                {!canFull ? <PaywallCard goal="stay-updated" /> : (
                  <div className="space-y-3">
                    {briefing.sections.summary.map((bullet, i) => (
                      <div key={i} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm card-lift">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-black text-indigo-600 mt-0.5">{i + 1}</span>
                        <p className="text-sm leading-relaxed text-slate-700">{bullet}</p>
                      </div>
                    ))}
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Also worth knowing</p>
                      <SectionContent text={briefing.sections.quickHits} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Content tab ── */}
            {activeTab === "create-content" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-900">✍️ Content Ideas</h2>
                  <p className="mt-1 text-xs text-slate-400">Post angles, hooks, and newsletter ideas — ready to publish</p>
                </div>
                {!canFull ? <PaywallCard goal="create-content" /> : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionContent text={briefing.sections.contentIdeas} />
                  </div>
                )}
              </div>
            )}

            {/* ── Sales tab ── */}
            {activeTab === "sell-better" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-900">🤝 Sales Intel</h2>
                  <p className="mt-1 text-xs text-slate-400">Buyer signals, conversation starters, objection handles</p>
                </div>
                {!canFull ? <PaywallCard goal="sell-better" /> : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionContent text={briefing.sections.salesIntel} />
                  </div>
                )}
              </div>
            )}

            {/* ── Learn tab ── */}
            {activeTab === "learn-faster" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-900">🧠 Explainers</h2>
                  <p className="mt-1 text-xs text-slate-400">Plain-English breakdowns of concepts and terms</p>
                </div>
                {!canFull ? <PaywallCard goal="learn-faster" /> : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionContent text={briefing.sections.explainers} />
                  </div>
                )}
              </div>
            )}

            {/* ── Strategy tab ── */}
            {activeTab === "lead-decide" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-900">🎯 Strategy Brief</h2>
                  <p className="mt-1 text-xs text-slate-400">Risk signals, opportunities, and decision frameworks</p>
                </div>
                {!canFull ? <PaywallCard goal="lead-decide" /> : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionContent text={briefing.sections.strategyBrief} />
                  </div>
                )}
              </div>
            )}

            {/* ── Drive Time tab ── */}
            {activeTab === "drive-time" && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 shadow-md shadow-slate-900/20">
                    <Radio className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Drive Time</h2>
                    <p className="text-xs text-slate-400">5-min radio-style briefing for your commute</p>
                  </div>
                </div>

                {!canFull ? (
                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900">
                      <Radio className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="mb-1 text-base font-black text-slate-900">Drive Time is Pro</p>
                    <p className="mb-5 text-sm text-slate-500">Get a daily 5-min briefing tailored to your industry and role.</p>
                    <Link href="/pricing"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
                      Upgrade to Pro — $9/mo
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl shadow-slate-900/20">
                    <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                      <span className="pulse-dot h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">On Air</span>
                    </div>
                    <div className="p-5">
                      {briefing.sections.driveTime.split("\n").filter(Boolean).map((line, i) => {
                        const isBold = line.startsWith("**");
                        const clean = line.replace(/\*\*/g, "");
                        return (
                          <p key={i} className={`mb-3 leading-relaxed ${
                            isBold
                              ? "text-sm font-bold text-emerald-400"
                              : "text-sm text-slate-300"
                          }`}>
                            {clean}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Social Posts tab ── */}
            {activeTab === "social-posts" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-900">📱 Social Posts</h2>
                  <p className="mt-1 text-xs text-slate-400">Ready-to-post content for LinkedIn, X, and newsletters — generated by the omgstack skill</p>
                </div>

                {!canFull ? (
                  <PaywallCard goal="create-content" />
                ) : !socialPostsRaw ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                      <Sparkles className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="mb-1 text-base font-black text-slate-700">No social posts for today yet</p>
                    <p className="mb-5 text-sm text-slate-500 max-w-xs mx-auto">
                      Run the skill from your terminal to generate LinkedIn posts, an X thread, and a newsletter teaser from today&apos;s signals.
                    </p>
                    <div className="inline-block rounded-xl bg-slate-900 px-5 py-3 font-mono text-sm text-emerald-400">
                      /omgstack social
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Posts will appear here automatically after the skill runs.
                    </p>
                  </div>
                ) : (
                  (() => {
                    const platforms = parseSocialSections(socialPostsRaw);
                    return (
                      <div>
                        {/* Platform tabs */}
                        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                          {platforms.map((p, i) => (
                            <button key={i} onClick={() => setActivePlatform(i)}
                              className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition-all no-select ${
                                activePlatform === i
                                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                  : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
                              }`}>
                              <span>{p.emoji}</span>
                              <span className="hidden sm:inline">{p.header}</span>
                            </button>
                          ))}
                        </div>

                        {platforms[activePlatform] && (
                          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                              <span className="text-sm font-black text-slate-900">
                                {platforms[activePlatform].emoji} {platforms[activePlatform].header}
                              </span>
                              <CopyButton text={platforms[activePlatform].body} />
                            </div>
                            <div className="p-5">
                              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                                {platforms[activePlatform].body}
                              </pre>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-center">
                          <p className="text-[11px] text-slate-400">
                            To refresh: <code className="bg-slate-200 rounded px-1.5 py-0.5 text-slate-600">/omgstack social</code>
                          </p>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
