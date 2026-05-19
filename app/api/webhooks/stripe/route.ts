import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { setUserTier, getUser, upsertUser } from "@/lib/db";
import type { PricingTier } from "@/lib/db/schema";
import type Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Map Stripe price IDs → our tier names
function priceIdToTier(priceId: string): PricingTier {
  const pro = [process.env.STRIPE_PRICE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO_ANNUAL];
  const premium = [process.env.STRIPE_PRICE_PREMIUM_MONTHLY, process.env.STRIPE_PRICE_PREMIUM_ANNUAL];
  if (pro.includes(priceId)) return "pro";
  if (premium.includes(priceId)) return "premium";
  return "free";
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerkUserId;
      const customerId = typeof session.customer === "string" ? session.customer : null;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
      if (!clerkUserId || !customerId || !subscriptionId) break;

      // Fetch subscription to get price ID
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = sub.items.data[0]?.price.id ?? "";
      const tier = priceIdToTier(priceId);

      const existing = await getUser(clerkUserId);
      if (!existing) await upsertUser({ id: clerkUserId, email: "", stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId });
      await setUserTier(clerkUserId, tier, { customerId, subscriptionId });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : null;
      if (!customerId) break;

      const clerkUserId = sub.metadata?.clerkUserId;
      if (!clerkUserId) break;

      const priceId = sub.items.data[0]?.price.id ?? "";
      const tier: PricingTier = sub.status === "active" ? priceIdToTier(priceId) : "free";
      await setUserTier(clerkUserId, tier, { customerId, subscriptionId: sub.id });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const clerkUserId = sub.metadata?.clerkUserId;
      if (!clerkUserId) break;
      await setUserTier(clerkUserId, "free");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
