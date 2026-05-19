import { clerkClient } from "@clerk/nextjs/server";
import type { UserRecord, SubscriberProfile, PricingTier } from "./schema";

type PublicMeta = {
  onboarded?: boolean;
  tier?: PricingTier;
  profile?: Omit<SubscriberProfile, "userId">;
};

type PrivateMeta = {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  createdAt?: string;
};

async function client() {
  return clerkClient();
}

export async function clerkGetUser(userId: string): Promise<UserRecord | null> {
  try {
    const c = await client();
    const user = await c.users.getUser(userId);
    const pub = (user.publicMetadata ?? {}) as PublicMeta;
    const priv = (user.privateMetadata ?? {}) as PrivateMeta;
    return {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      tier: pub.tier ?? "free",
      stripeCustomerId: priv.stripeCustomerId ?? null,
      stripeSubscriptionId: priv.stripeSubscriptionId ?? null,
      onboarded: pub.onboarded ?? false,
      createdAt: priv.createdAt ?? new Date(user.createdAt).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function clerkUpsertUser(
  data: Partial<UserRecord> & { id: string; email: string }
): Promise<UserRecord> {
  // No write needed — Clerk already has the user. Just return current state.
  const existing = await clerkGetUser(data.id);
  return existing ?? {
    id: data.id,
    email: data.email,
    tier: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    onboarded: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function clerkMarkOnboarded(userId: string): Promise<void> {
  const c = await client();
  await c.users.updateUserMetadata(userId, {
    publicMetadata: { onboarded: true },
  });
}

export async function clerkGetProfile(userId: string): Promise<SubscriberProfile | null> {
  try {
    const c = await client();
    const user = await c.users.getUser(userId);
    const pub = (user.publicMetadata ?? {}) as PublicMeta;
    if (!pub.profile) return null;
    return { ...pub.profile, userId };
  } catch {
    return null;
  }
}

export async function clerkUpsertProfile(
  data: Partial<SubscriberProfile> & { userId: string }
): Promise<SubscriberProfile> {
  const existing = await clerkGetProfile(data.userId);
  const profile: SubscriberProfile = {
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
  const { userId, ...profileData } = profile;
  const c = await client();
  await c.users.updateUserMetadata(userId, {
    publicMetadata: { profile: profileData },
  });
  return profile;
}

export async function clerkSetUserTier(
  userId: string,
  tier: PricingTier,
  stripeData?: { customerId?: string; subscriptionId?: string }
): Promise<void> {
  const c = await client();
  await c.users.updateUserMetadata(userId, {
    publicMetadata: { tier },
    ...(stripeData && {
      privateMetadata: {
        ...(stripeData.customerId ? { stripeCustomerId: stripeData.customerId } : {}),
        ...(stripeData.subscriptionId ? { stripeSubscriptionId: stripeData.subscriptionId } : {}),
      },
    }),
  });
}
