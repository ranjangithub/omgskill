import type { UserRecord, SubscriberProfile, BriefingRecord, PricingTier } from "./schema";
import { readBriefing, writeBriefing, listBriefingDatesForPersona, findBriefingForIndustry } from "@/lib/briefing-store";
import {
  clerkGetUser, clerkUpsertUser, clerkSetUserTier, clerkMarkOnboarded,
  clerkGetProfile, clerkUpsertProfile,
} from "./clerk-store";

// ── Users (Clerk metadata-backed) ────────────────────────────────

export async function upsertUser(data: Partial<UserRecord> & { id: string; email: string }): Promise<UserRecord> {
  return clerkUpsertUser(data);
}

export async function getUser(userId: string): Promise<UserRecord | null> {
  return clerkGetUser(userId);
}

export async function setUserTier(
  userId: string,
  tier: PricingTier,
  stripeData?: { customerId?: string; subscriptionId?: string }
): Promise<void> {
  return clerkSetUserTier(userId, tier, stripeData);
}

export async function markOnboarded(userId: string): Promise<void> {
  return clerkMarkOnboarded(userId);
}

// ── Subscriber Profiles (Clerk metadata-backed) ──────────────────

export async function upsertProfile(
  data: Partial<SubscriberProfile> & { userId: string }
): Promise<SubscriberProfile> {
  return clerkUpsertProfile(data);
}

export async function getProfile(userId: string): Promise<SubscriberProfile | null> {
  return clerkGetProfile(userId);
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
