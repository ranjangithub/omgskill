#!/usr/bin/env tsx
/**
 * Local briefing generator — run this from the terminal to generate today's briefings.
 *
 * Usage:
 *   npm run generate              # generate all default personas
 *   npm run generate healthcare   # generate only the healthcare persona
 *   npm run generate healthcare sales  # generate healthcare × sales
 *
 * Requirements:
 *   ANTHROPIC_API_KEY must be set in .env.local
 */

import { config } from "dotenv";
import path from "path";

// Load .env.local before anything else
config({ path: path.join(process.cwd(), ".env.local") });

import { fetchArticlesForIndustry } from "../lib/rss-fetcher";
import { generateBriefing } from "../lib/briefing-generator";
import { writeBriefing } from "../lib/briefing-store";

// Default personas — same list as the cron route
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

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  ANTHROPIC_API_KEY is not set. Add it to .env.local");
    process.exit(1);
  }

  const [, , filterIndustry, filterRole] = process.argv;

  const personas = DEFAULT_PERSONAS.filter((p) => {
    if (filterIndustry && p.industry !== filterIndustry) return false;
    if (filterRole && p.role !== filterRole) return false;
    return true;
  });

  if (personas.length === 0) {
    console.error(`❌  No personas match: industry="${filterIndustry}" role="${filterRole}"`);
    console.log("Available industries:", [...new Set(DEFAULT_PERSONAS.map((p) => p.industry))].join(", "));
    process.exit(1);
  }

  const today = new Date().toISOString().split("T")[0];
  console.log(`\n🗓  Generating briefings for ${today}`);
  console.log(`📋  Personas: ${personas.length}\n`);

  // Group by industry to reuse RSS fetch
  const byIndustry = new Map<string, typeof DEFAULT_PERSONAS>();
  for (const p of personas) {
    const list = byIndustry.get(p.industry) ?? [];
    list.push(p);
    byIndustry.set(p.industry, list);
  }

  let totalOk = 0;
  let totalFailed = 0;

  for (const [industry, group] of byIndustry) {
    console.log(`📡  Fetching RSS for ${industry}...`);
    const { articles, sourceCount, failedCount } = await fetchArticlesForIndustry(industry);
    console.log(`    ${articles.length} articles from ${sourceCount} sources (${failedCount} failed)\n`);

    for (const persona of group) {
      const label = `${persona.industry} × ${persona.role}`;
      process.stdout.write(`🤖  Generating ${label}... `);
      try {
        const briefing = await generateBriefing({
          ...persona,
          articles,
          date: today,
        });
        writeBriefing(briefing);
        console.log(`✓  (${briefing.signals.length} signals)`);
        console.log(`    Saved → data/briefings/${today}/${briefing.personaKey.replace(/[|]/g,"_")}.json\n`);
        totalOk++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`✗`);
        console.error(`    Error: ${msg}\n`);
        totalFailed++;
      }
    }
  }

  console.log("─".repeat(50));
  console.log(`✅  Done — ${totalOk} generated, ${totalFailed} failed`);
  if (totalOk > 0) {
    console.log(`\n📁  Briefings saved to: data/briefings/${today}/`);
    console.log(`🌐  View at: http://localhost:3004/dashboard`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
