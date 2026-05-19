import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { TIER_CONFIGS } from "@/lib/stripe/config";
import { getUser, upsertUser } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tier, interval = "month" } = await req.json() as { tier: "pro" | "premium"; interval?: "month" | "year" };
  const config = TIER_CONFIGS[tier];
  if (!config) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  const priceId = interval === "year" ? config.annualPriceId : config.monthlyPriceId;
  if (!priceId) return NextResponse.json({ error: "Stripe price not configured" }, { status: 500 });

  const dbUser = await getUser(userId);
  let customerId = dbUser?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ metadata: { clerkUserId: userId } });
    customerId = customer.id;
    await upsertUser({ id: userId, email: dbUser?.email ?? "", stripeCustomerId: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { clerkUserId: userId, tier },
  });

  return NextResponse.json({ url: session.url });
}
