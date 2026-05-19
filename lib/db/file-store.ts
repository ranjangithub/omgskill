/**
 * File-based persistence for users and profiles.
 * Survives dev server restarts. Stored at data/users/{userId}.json
 */
import fs from "fs";
import path from "path";
import type { UserRecord, SubscriberProfile } from "./schema";

// On Vercel, process.cwd() is read-only — use /tmp instead (ephemeral but writable)
const STORE_DIR = process.env.VERCEL
  ? path.join("/tmp", "omgskill-users")
  : path.join(process.cwd(), "data", "users");

function userFile(userId: string): string {
  return path.join(STORE_DIR, `${userId}.json`);
}

interface UserStore {
  user: UserRecord;
  profile?: SubscriberProfile;
}

function read(userId: string): UserStore | null {
  try {
    const file = userFile(userId);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf-8")) as UserStore;
  } catch {
    return null;
  }
}

function write(userId: string, store: UserStore): void {
  fs.mkdirSync(STORE_DIR, { recursive: true });
  fs.writeFileSync(userFile(userId), JSON.stringify(store, null, 2), "utf-8");
}

export function fsGetUser(userId: string): UserRecord | null {
  return read(userId)?.user ?? null;
}

export function fsUpsertUser(data: Partial<UserRecord> & { id: string; email: string }): UserRecord {
  const store = read(data.id);
  const now = new Date().toISOString();
  const record: UserRecord = {
    tier: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    onboarded: false,
    createdAt: store?.user.createdAt ?? now,
    updatedAt: now,
    ...store?.user,
    ...data,
  };
  write(data.id, { ...store, user: record });
  return record;
}

export function fsSetUserTier(
  userId: string,
  tier: import("./schema").PricingTier,
  stripeData?: { customerId?: string; subscriptionId?: string }
): void {
  const store = read(userId);
  if (!store) return;
  const user: UserRecord = {
    ...store.user,
    tier,
    stripeCustomerId: stripeData?.customerId ?? store.user.stripeCustomerId,
    stripeSubscriptionId: stripeData?.subscriptionId ?? store.user.stripeSubscriptionId,
    updatedAt: new Date().toISOString(),
  };
  write(userId, { ...store, user });
}

export function fsMarkOnboarded(userId: string): void {
  const store = read(userId);
  if (!store) return;
  write(userId, { ...store, user: { ...store.user, onboarded: true, updatedAt: new Date().toISOString() } });
}

export function fsGetProfile(userId: string): SubscriberProfile | null {
  return read(userId)?.profile ?? null;
}

export function fsUpsertProfile(data: Partial<SubscriberProfile> & { userId: string }): SubscriberProfile {
  const store = read(data.userId);
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
    ...store?.profile,
    ...data,
  };
  const user: UserRecord = store?.user ?? {
    id: data.userId,
    email: "",
    tier: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    onboarded: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  write(data.userId, { user, profile: record });
  return record;
}
