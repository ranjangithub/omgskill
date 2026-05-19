import type { Metadata } from "next";
import Link from "next/link";
import { Check, Flame, X } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { Footer } from "@/components/footer";
import { FREE_FEATURES, PRO_FEATURES, PREMIUM_FEATURES } from "@/lib/stripe/config";

export const metadata: Metadata = { title: "Pricing" };

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: { month: "$0", year: "$0" },
    description: "Get a feel for the curation quality before committing.",
    features: FREE_FEATURES,
    notIncluded: ["LinkedIn hooks", "Drive Time scripts", "Full 10 signals", "Personalization"],
    cta: "Start free",
    href: "/sign-up",
    highlight: false,
    badge: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: { month: "$9", year: "$86" },
    perMonth: { year: "$7.17" },
    description: "Full intelligence — 10 signals, LinkedIn hooks, Drive Time. Built for daily use.",
    features: PRO_FEATURES,
    notIncluded: ["Hyper-personalization (LinkedIn + voice)", "Custom signal ordering"],
    cta: "Start Pro",
    href: "/sign-up?tier=pro",
    highlight: false,
    badge: null,
  },
  {
    id: "premium",
    name: "Premium",
    price: { month: "$29", year: "$278" },
    perMonth: { year: "$23.17" },
    description: "Your briefing, tuned to you specifically — LinkedIn, inspirations, your voice.",
    features: PREMIUM_FEATURES,
    notIncluded: [],
    cta: "Start Premium",
    href: "/sign-up?tier=premium",
    highlight: true,
    badge: "Most Personal",
  },
];

const COMPARE = [
  { feature: "Daily signals", free: "3", pro: "10", premium: "10 (personalized)" },
  { feature: "Signal classification", free: "✓", pro: "✓", premium: "✓" },
  { feature: "LinkedIn hooks", free: "—", pro: "✓", premium: "✓ (your voice)" },
  { feature: "Drive Time scripts", free: "—", pro: "1 / day", premium: "5 / day" },
  { feature: "Archive access", free: "7 days", pro: "Full archive", premium: "Full archive" },
  { feature: "Daily email", free: "Weekly digest", pro: "Daily", premium: "Daily + personalized" },
  { feature: "Persona-based framing", free: "—", pro: "✓", premium: "✓" },
  { feature: "LinkedIn profile input", free: "—", pro: "—", premium: "✓" },
  { feature: "Inspirations / mental models", free: "—", pro: "—", premium: "✓" },
  { feature: "Voice preference", free: "—", pro: "—", premium: "✓" },
  { feature: "Signal ordering by your projects", free: "—", pro: "—", premium: "✓" },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MarketingNav />

      <section className="bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-20 text-white text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-300">
            <Flame className="h-4 w-4" /> Simple, honest pricing
          </div>
          <h1 className="mb-4 text-4xl font-black">Pay for the intelligence you use</h1>
          <p className="text-lg text-slate-300">Start free. Upgrade when you want more. Cancel anytime — no lock-in.</p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div key={tier.id}
                className={`relative flex flex-col rounded-2xl border p-8 ${tier.highlight
                  ? "border-indigo-500 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm"}`}>
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-white">
                    {tier.badge}
                  </div>
                )}
                <div className="mb-6">
                  <p className={`mb-1 text-sm font-bold uppercase tracking-widest ${tier.highlight ? "text-indigo-200" : "text-indigo-600"}`}>{tier.name}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-5xl font-black">{tier.price.month}</span>
                    {tier.id !== "free" && <span className={`mb-1 text-sm ${tier.highlight ? "text-indigo-200" : "text-slate-400"}`}>/month</span>}
                  </div>
                  {tier.perMonth && (
                    <p className={`text-xs mb-3 ${tier.highlight ? "text-indigo-200" : "text-slate-400"}`}>{tier.perMonth.year}/mo billed annually · Save 20%</p>
                  )}
                  <p className={`text-sm leading-relaxed ${tier.highlight ? "text-indigo-100" : "text-slate-500"}`}>{tier.description}</p>
                </div>

                <Link href={tier.href}
                  className={`mb-8 block rounded-xl py-3 text-center text-sm font-bold transition-colors ${tier.highlight
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : tier.id === "free" ? "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                  {tier.cta}
                </Link>

                <ul className="space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tier.highlight ? "text-emerald-300" : "text-emerald-500"}`} />
                      <span className={tier.highlight ? "text-indigo-50" : "text-slate-700"}>{f}</span>
                    </li>
                  ))}
                  {tier.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="border-t border-slate-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-black text-slate-900">Full feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="pb-4 text-left font-bold text-slate-500 w-1/2">Feature</th>
                  <th className="pb-4 text-center font-bold text-slate-900">Free</th>
                  <th className="pb-4 text-center font-bold text-indigo-600">Pro</th>
                  <th className="pb-4 text-center font-bold text-indigo-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-slate-50/50" : ""}`}>
                    <td className="py-3.5 font-medium text-slate-700">{row.feature}</td>
                    <td className="py-3.5 text-center text-slate-500">{row.free}</td>
                    <td className="py-3.5 text-center text-slate-800">{row.pro}</td>
                    <td className="py-3.5 text-center font-semibold text-indigo-600">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
