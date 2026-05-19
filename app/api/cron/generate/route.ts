/**
 * POST /api/cron/generate
 *
 * Nightly briefing generator — called by Vercel Cron at 05:00 UTC.
 * Also callable manually: curl -X POST https://your-app.vercel.app/api/cron/generate \
 *   -H "Authorization: Bearer $CRON_SECRET"
 *
 * What it does:
 *   1. For each industry, fetches RSS articles
 *   2. For each active persona (industry × role × goals combination that has
 *      at least one subscriber), calls Claude to generate a full briefing
 *   3. Saves briefings to data/briefings/{date}/{personaKey}.json
 *
 * In a real production app you'd query your DB for active personas.
 * For now it generates the 10 industry defaults (one per industry).
 */
import { NextResponse } from "next/server";
import { fetchArticlesForIndustry } from "@/lib/rss-fetcher";
import { generateBriefing } from "@/lib/briefing-generator";
import { writeBriefing } from "@/lib/briefing-store";

// The personas to generate every night.
// In production, query your DB: SELECT DISTINCT industry, role, content_goals FROM profiles.
const DEFAULT_PERSONAS = [
  { industry: "technology-saas",    role: "technology",  contentGoals: ["stay-updated", "create-content"] },
  { industry: "healthcare",         role: "executive",   contentGoals: ["stay-updated", "lead-decide"]    },
  { industry: "banking-finance",    role: "executive",   contentGoals: ["stay-updated", "lead-decide"]    },
  { industry: "insurance",          role: "sales",       contentGoals: ["stay-updated", "sell-better"]    },
  { industry: "education",          role: "executive",   contentGoals: ["stay-updated", "learn-faster"]   },
  { industry: "real-estate",        role: "sales",       contentGoals: ["stay-updated", "sell-better"]    },
  { industry: "retail-ecommerce",   role: "executive",   contentGoals: ["stay-updated", "lead-decide"]    },
  { industry: "manufacturing",      role: "technology",  contentGoals: ["stay-updated", "lead-decide"]    },
  { industry: "legal-compliance",   role: "consultant",  contentGoals: ["stay-updated", "create-content"] },
  { industry: "government",         role: "executive",   contentGoals: ["stay-updated", "lead-decide"]    },
];

export async function POST(req: Request) {
  // Verify cron secret — prevents unauthorized triggers
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const today = new Date().toISOString().split("T")[0];
  const results: Array<{ persona: string; status: "ok" | "error"; error?: string }> = [];

  // Group personas by industry to reuse RSS fetch
  const byIndustry = new Map<string, typeof DEFAULT_PERSONAS>();
  for (const p of DEFAULT_PERSONAS) {
    const list = byIndustry.get(p.industry) ?? [];
    list.push(p);
    byIndustry.set(p.industry, list);
  }

  for (const [industry, personas] of byIndustry) {
    console.log(`[cron] Fetching RSS for ${industry}...`);
    const { articles, sourceCount, failedCount } = await fetchArticlesForIndustry(industry);
    console.log(`[cron] ${industry}: ${articles.length} articles from ${sourceCount} sources (${failedCount} failed)`);

    for (const persona of personas) {
      const label = `${persona.industry}/${persona.role}`;
      try {
        console.log(`[cron] Generating briefing for ${label}...`);
        const briefing = await generateBriefing({
          ...persona,
          articles,
          date: today,
        });
        writeBriefing(briefing);
        results.push({ persona: label, status: "ok" });
        console.log(`[cron] ✓ ${label} saved`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ persona: label, status: "error", error: msg });
        console.error(`[cron] ✗ ${label}: ${msg}`);
      }
    }
  }

  const ok = results.filter((r) => r.status === "ok").length;
  const failed = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    date: today,
    generated: ok,
    failed,
    results,
  });
}

// Vercel Cron calls GET by default when using the vercel.json cron config
export async function GET(req: Request) {
  // Vercel Cron sends the secret via header automatically
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Delegate to POST logic by reconstructing a POST-like request
  return POST(req);
}
