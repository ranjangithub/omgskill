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
  role: string;         // "Enterprise Architect" | "AI Product Manager" | etc.
  industry: string;     // "FinTech" | "Healthcare" | etc.
  topics: string[];     // ["AI Governance", "RAG", "AI Security", ...]
  linkedinUrl: string | null;
  linkedinSummary: string | null;  // scraped / pasted content
  inspirations: string | null;     // "Karpathy, Ben Thompson, ..."
  currentProjects: string | null;  // what they're building right now
  voicePreference: "analytical" | "conversational" | "executive";
  updatedAt: string;
}

export interface BriefingRecord {
  id: string;
  date: string;           // YYYY-MM-DD
  personaKey: string;     // hash of role+industry+topics for cache lookup
  signals: SignalRecord[];
  sections: BriefingSections;
  articlesFetched: number;
  generatedAt: string;
}

export interface SignalRecord {
  number: number;
  title: string;
  classification: "Strategic Signal" | "Emerging Trend" | "Tactical Update" | "Governance Alert" | "Hype/Noise";
  whatHappened: string;
  whyItMatters: string;
  sdlcImpact: string;
  governanceImpact: string;
  architectureImpact: string;
  myTake: string;
  linkedinAngle: string;
  hook: string;
  driveTimeScript?: string;
}

export interface BriefingSections {
  executiveSummary: string[];
  quickHits: string;
  research: string;
  governance: string;
  driveTime: string;
}
