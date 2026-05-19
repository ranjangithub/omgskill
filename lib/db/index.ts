import type { UserRecord, SubscriberProfile, BriefingRecord, PricingTier } from "./schema";
import { readBriefing, writeBriefing, listBriefingDatesForPersona, findBriefingForIndustry } from "@/lib/briefing-store";
import {
  fsGetUser, fsUpsertUser, fsSetUserTier, fsMarkOnboarded,
  fsGetProfile, fsUpsertProfile,
} from "./file-store";

// ── Users (file-backed, survives dev server restarts) ────────────

export function upsertUser(data: Partial<UserRecord> & { id: string; email: string }): UserRecord {
  return fsUpsertUser(data);
}

export function getUser(userId: string): UserRecord | null {
  return fsGetUser(userId);
}

export function setUserTier(
  userId: string,
  tier: PricingTier,
  stripeData?: { customerId?: string; subscriptionId?: string }
) {
  fsSetUserTier(userId, tier, stripeData);
}

export function markOnboarded(userId: string) {
  fsMarkOnboarded(userId);
}

// ── Subscriber Profiles (file-backed) ───────────────────────────

export function upsertProfile(
  data: Partial<SubscriberProfile> & { userId: string }
): SubscriberProfile {
  return fsUpsertProfile(data);
}

export function getProfile(userId: string): SubscriberProfile | null {
  return fsGetProfile(userId);
}

// ── Briefings (file-backed via lib/briefing-store.ts) ───────────

export function getBriefing(date: string, personaKey: string): BriefingRecord | null {
  // Exact match first
  const exact = readBriefing(date, personaKey);
  if (exact) return exact;
  // Fuzzy: any briefing from today for the same industry
  const industry = personaKey.split("|")[0];
  return findBriefingForIndustry(date, industry);
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
