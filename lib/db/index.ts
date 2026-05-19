import type { UserRecord, SubscriberProfile, BriefingRecord, PricingTier } from "./schema";
import { readBriefing, writeBriefing, listBriefingDatesForPersona } from "@/lib/briefing-store";

// In-memory store for users + profiles (swap for Supabase/PostgreSQL in production)
// Briefings use file-based storage via lib/briefing-store.ts

const users    = new Map<string, UserRecord>();
const profiles = new Map<string, SubscriberProfile>();

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

export function setUserTier(
  userId: string,
  tier: PricingTier,
  stripeData?: { customerId?: string; subscriptionId?: string }
) {
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

// ── Subscriber Profiles ──────────────────────────────────────────

export function upsertProfile(
  data: Partial<SubscriberProfile> & { userId: string }
): SubscriberProfile {
  const existing = profiles.get(data.userId);
  const record: SubscriberProfile = {
    industry: "technology-saas",
    role: "technology",
    contentGoals: ["stay-updated"],
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

// ── Briefings (file-backed via lib/briefing-store.ts) ───────────

export function getBriefing(date: string, personaKey: string): BriefingRecord | null {
  return readBriefing(date, personaKey);
}

export function saveBriefing(briefing: BriefingRecord): void {
  writeBriefing(briefing);
}

export function listBriefingDates(personaKey: string): string[] {
  return listBriefingDatesForPersona(personaKey);
}

// ── Persona key ───────────────────────────────────────────────────
// Cache key: industry + role + sorted content goals
export function buildPersonaKey(
  industry: string,
  role: string,
  contentGoals: string[]
): string {
  const sortedGoals = [...contentGoals].sort().join(",");
  return `${industry}|${role}|${sortedGoals}`.toLowerCase().replace(/\s+/g, "_");
}
