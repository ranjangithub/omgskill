export type PricingTier = "free" | "pro" | "premium";

export interface UserRecord {
  id: string;           // Clerk user_id
  email: string;
  tier: PricingTier;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberProfile {
  userId: string;
  // Level 1 — Industry
  industry: string;        // INDUSTRIES[n].id e.g. "healthcare", "banking-finance"
  // Level 2 — Role
  role: string;            // ROLES[n].id e.g. "sales", "executive", "technology"
  // Level 3 — Content Goals (ordered by priority, 1–3 selected)
  contentGoals: string[];  // ["stay-updated", "create-content", ...]
  // Premium personalization
  linkedinUrl: string | null;
  linkedinSummary: string | null;
  inspirations: string | null;
  currentProjects: string | null;
  voicePreference: "analytical" | "conversational" | "executive";
  updatedAt: string;
}

export interface BriefingRecord {
  id: string;
  date: string;           // YYYY-MM-DD
  personaKey: string;     // cache key derived from industry+role+contentGoals
  signals: SignalRecord[];
  sections: BriefingSections;
  articlesFetched: number;
  generatedAt: string;
}

export interface SignalRecord {
  number: number;
  title: string;
  classification: "Strategic Signal" | "Emerging Trend" | "Tactical Update" | "Governance Alert" | "Hype/Noise";
  // Core (all tiers)
  whatHappened: string;
  whyItMatters: string;
  // Pro+
  industryImpact: string;
  roleImpact: string;
  myTake: string;
  hook: string;            // LinkedIn hook (ready to paste)
  // Per content goal (generated selectively)
  contentAngle?: string;   // for "create-content" goal
  salesIntel?: string;     // for "sell-better" goal
  explainer?: string;      // for "learn-faster" goal
  executiveBrief?: string; // for "lead-decide" goal
  driveTimeScript?: string;
}

export interface BriefingSections {
  // "stay-updated" goal
  summary: string[];       // 3–5 bullet executive summary
  quickHits: string;       // short signals, no full analysis
  // "create-content" goal
  contentIdeas: string;    // post angles, newsletter ideas
  driveTime: string;       // 5-min radio script
  // "sell-better" goal
  salesIntel: string;      // buyer signals, outreach angles
  // "learn-faster" goal
  explainers: string;      // concept breakdowns, frameworks
  // "lead-decide" goal
  strategyBrief: string;   // risk matrix, opportunity map
}
