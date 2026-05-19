import type { UserRecord, SubscriberProfile, BriefingRecord, PricingTier } from "./schema";

// In-memory store for local dev — swap for Supabase/PostgreSQL in production
// Replace these Maps with Drizzle + postgres driver when deploying

const users = new Map<string, UserRecord>();
const profiles = new Map<string, SubscriberProfile>();
const briefings = new Map<string, BriefingRecord>(); // key: `${date}:${personaKey}`

// ── Users ──────────────────────────────────────────────────────

export function upsertUser(data: Partial<UserRecord> & { id: string; email: string }): UserRecord {
  const existing = users.get(data.id);
  const now = new Date().toISOString();
  const record: UserRecord = {
    tier: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    onboarded: false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...existing,
    ...data,
  };
  users.set(data.id, record);
  return record;
}

export function getUser(userId: string): UserRecord | null {
  return users.get(userId) ?? null;
}

export function setUserTier(userId: string, tier: PricingTier, stripeData?: { customerId?: string; subscriptionId?: string }) {
  const user = users.get(userId);
  if (!user) return;
  users.set(userId, {
    ...user,
    tier,
    stripeCustomerId: stripeData?.customerId ?? user.stripeCustomerId,
    stripeSubscriptionId: stripeData?.subscriptionId ?? user.stripeSubscriptionId,
    updatedAt: new Date().toISOString(),
  });
}

export function markOnboarded(userId: string) {
  const user = users.get(userId);
  if (user) users.set(userId, { ...user, onboarded: true, updatedAt: new Date().toISOString() });
}

// ── Subscriber Profiles ─────────────────────────────────────────

export function upsertProfile(data: Partial<SubscriberProfile> & { userId: string }): SubscriberProfile {
  const existing = profiles.get(data.userId);
  const record: SubscriberProfile = {
    role: "Enterprise Architect",
    industry: "General Tech",
    topics: ["Generative AI"],
    linkedinUrl: null,
    linkedinSummary: null,
    inspirations: null,
    currentProjects: null,
    voicePreference: "analytical",
    updatedAt: new Date().toISOString(),
    ...existing,
    ...data,
  };
  profiles.set(data.userId, record);
  return record;
}

export function getProfile(userId: string): SubscriberProfile | null {
  return profiles.get(userId) ?? null;
}

// ── Briefings ───────────────────────────────────────────────────

export function getBriefing(date: string, personaKey: string): BriefingRecord | null {
  return briefings.get(`${date}:${personaKey}`) ?? null;
}

export function saveBriefing(briefing: BriefingRecord): void {
  briefings.set(`${briefing.date}:${briefing.personaKey}`, briefing);
}

export function listBriefingDates(personaKey: string): string[] {
  return Array.from(briefings.keys())
    .filter((k) => k.endsWith(`:${personaKey}`))
    .map((k) => k.split(":")[0])
    .sort()
    .reverse();
}

// ── Persona key ──────────────────────────────────────────────────

export function buildPersonaKey(role: string, industry: string, topics: string[]): string {
  const sorted = [...topics].sort().join(",");
  return `${role}|${industry}|${sorted}`.toLowerCase().replace(/\s+/g, "_");
}
