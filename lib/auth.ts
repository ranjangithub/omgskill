import { auth, currentUser } from "@clerk/nextjs/server";
import { getUser, upsertUser } from "./db";
import type { UserRecord } from "./db/schema";

export async function getAuthUser(): Promise<{ clerkUser: Awaited<ReturnType<typeof currentUser>>; dbUser: UserRecord | null }> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { clerkUser: null, dbUser: null };

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const dbUser = await upsertUser({ id: clerkUser.id, email });

  return { clerkUser, dbUser };
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export function getTierLabel(tier: string) {
  return { free: "Free", pro: "Pro", premium: "Premium" }[tier] ?? "Free";
}

export function canAccessFullBriefing(tier: string) {
  return tier === "pro" || tier === "premium";
}

export function canAccessPersonalization(tier: string) {
  return tier === "premium";
}
