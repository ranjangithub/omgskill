# omgskill.ai — Build Log

> A living document of every feature request and implementation decision, built together by Rajesh Ranjan and Claude Code. Published to show the world how a full SaaS product is built using AI-native development.

---

## The Idea

**Origin:** Rajesh Ranjan already built DailyTechDose — a personal AI intelligence tool that scans 30+ RSS feeds daily, curates 10 signals through an expert enterprise AI lens, and generates LinkedIn hooks + Drive Time radio scripts. The question was: can this become a product?

**The pivot insight:** The value is not just the automation — it is the expert curation prompt that encodes 20 years of enterprise AI architecture judgment. Subscribers pay for that lens, with optional hyper-personalization layered on top.

**Product name:** omgskill.ai — daily AI intelligence, personalized to your role and interests.

---

## Build Sessions

### Session 1 — May 19, 2026

**Requested by:** Rajesh Ranjan  
**Built by:** Claude Code (claude-sonnet-4-6)

#### Features implemented:

**Foundation**
- Scaffolded Next.js 15 + TypeScript + Tailwind CSS project
- Installed: Clerk (auth), Stripe (billing), Lucide (icons), Anthropic SDK (AI), Resend (email), Drizzle ORM (database)
- Tech stack mirrors hangarbrain-copilot-lite: Next.js + Clerk + Stripe + SQLite (local) / PostgreSQL (prod)

**Database schema** (`lib/db/schema.ts`)
- `users` table — Clerk user_id, email, tier (free/pro/premium), Stripe customer/subscription IDs, onboarded flag
- `subscriber_profiles` table — role, industry, topics (array), LinkedIn URL, inspirations, voice preference
- `briefings` table — date, persona key, content JSON (10 signals + sections)
- `user_briefings` table — links users to briefings, stores personalized signal order

**Auth** (`middleware.ts`, `lib/auth.ts`)
- Clerk middleware protecting `/dashboard/*` and `/settings/*` and `/onboarding`
- Public routes: `/`, `/pricing`, `/sign-in`, `/sign-up`, `/api/webhooks/*`

**Stripe config** (`lib/stripe/config.ts`)
- Free tier: $0 — top 3 signals, no LinkedIn hooks
- Pro tier: $9/month — full 10 signals + LinkedIn hooks + Drive Time
- Premium tier: $29/month — hyper-personalized (LinkedIn, inspirations, voice)

**Pages built**
- `/` — Marketing landing page (hero, features, social proof, pricing preview, CTA)
- `/pricing` — Full pricing page with tier comparison, monthly/annual toggle
- `/sign-in`, `/sign-up` — Clerk-powered auth pages
- `/onboarding` — Multi-step profile setup (role, industry, topics, LinkedIn + inspirations for premium)
- `/dashboard` — Main briefing reader (10 signals, Drive Time tab, LinkedIn hooks tab)
- `/dashboard/[date]` — Archive reader
- `/settings` — Profile + subscription management
- `/api/webhooks/stripe` — Subscription lifecycle (created, updated, deleted, paid)
- `/api/billing/checkout` — Create Stripe checkout session
- `/api/billing/portal` — Create Stripe billing portal session
- `/api/briefing/[date]` — Serve daily briefing content (tier-gated)

**Design system**
- Color palette: slate-950 base, indigo-600 primary, emerald-500 accent (matches hangarbrain)
- Components: `<PaywallBanner>`, `<TierBadge>`, `<SignalCard>`, `<DashboardNav>`, `<MarketingNav>`

#### Architecture decisions logged:
- **No separate backend** — all API routes in Next.js (vs. hangarbrain's FastAPI). DailyTechDose is pure Next.js; keeping consistency.
- **SQLite local / PostgreSQL prod** — same pattern as hangarbrain. Drizzle ORM handles both.
- **Persona-based briefing generation** — one Claude call per unique persona combination per day, not per subscriber. Keeps AI cost at ~$0.24/day regardless of subscriber count.
- **Paywall at signal level** — Free users see signals 1–3 locked behind blur. Pro users see 1–10. Premium users see personalized re-ordering + custom framing.

---

*This log is updated every build session. Each entry records what was requested, what was built, and why.*
