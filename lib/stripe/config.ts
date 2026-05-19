export type BillingInterval = "month" | "year";
export type PricingTier = "free" | "pro" | "premium";

export type TierConfig = {
  name: string;
  highlight?: boolean;
  monthlyPriceCents: number;
  annualPriceCents: number;
  monthlyPriceId?: string;
  annualPriceId?: string;
  description: string;
  badge?: string;
};

export const TIER_CONFIGS: Record<Exclude<PricingTier, "free">, TierConfig> = {
  pro: {
    name: "Pro",
    monthlyPriceCents: 900,
    annualPriceCents: 8600,
    monthlyPriceId: process.env.STRIPE_PRICE_PRO_MONTHLY,
    annualPriceId: process.env.STRIPE_PRICE_PRO_ANNUAL,
    description: "Full 10 signals, LinkedIn hooks, Drive Time scripts.",
  },
  premium: {
    name: "Premium",
    highlight: true,
    badge: "Most Popular",
    monthlyPriceCents: 2900,
    annualPriceCents: 27800,
    monthlyPriceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    annualPriceId: process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
    description: "Hyper-personalized briefing tuned to your LinkedIn, inspirations, and voice.",
  },
};

export const FREE_FEATURES = [
  "Top 3 signals daily",
  "Basic classification (Strategic / Governance / Hype)",
  "Web reader + 7-day archive",
  "Weekly digest email",
];

export const PRO_FEATURES = [
  "All 10 curated signals daily",
  "LinkedIn hooks — one per signal, ready to paste",
  "Drive Time radio script (top signal)",
  "Persona-based framing (role + industry)",
  "Full archive — every briefing, searchable",
  "Daily email delivery",
];

export const PREMIUM_FEATURES = [
  "Everything in Pro",
  "Hyper-personalized to your LinkedIn profile",
  "Briefing framed for your inspirations & mental models",
  "LinkedIn hooks written in your voice",
  "5 Drive Time scripts per day (all top signals)",
  "Priority signal ordering based on your current projects",
  "Monthly personalization review + prompt refinement",
];
