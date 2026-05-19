/**
 * Generates a full BriefingRecord for a given persona using Claude.
 * Called by the nightly job for each active persona.
 */
import Anthropic from "@anthropic-ai/sdk";
import { buildPersonaKey } from "@/lib/db";
import type { BriefingRecord, SignalRecord, BriefingSections } from "@/lib/db/schema";
import { INDUSTRIES, ROLES, CONTENT_GOALS } from "@/lib/personas/taxonomy";
import type { RssArticle } from "@/lib/rss-fetcher";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Prompt builder ──────────────────────────────────────────────────────────

function buildPrompt(opts: {
  industry: string;
  role: string;
  contentGoals: string[];
  articles: RssArticle[];
  date: string;
}): string {
  const industryLabel = INDUSTRIES.find((i) => i.id === opts.industry)?.label ?? opts.industry;
  const roleLabel = ROLES.find((r) => r.id === opts.role)?.label ?? opts.role;
  const goalLabels = opts.contentGoals
    .map((g) => CONTENT_GOALS.find((c) => c.id === g)?.label ?? g)
    .join(", ");

  const articleList = opts.articles
    .slice(0, 80) // Cap context size — top 80 most recent
    .map((a, i) => `[${i + 1}] ${a.title}\nSource: ${a.source} | Date: ${a.date}\n${a.summary}`)
    .join("\n\n");

  return `You are the omgskill intelligence engine. Generate a daily briefing for this user profile:

- Industry: ${industryLabel}
- Role: ${roleLabel}
- Content goals: ${goalLabels}
- Date: ${opts.date}

## Your task

Review these ${opts.articles.length} articles and select the 3 most relevant signals for this user. Apply the 3-lens test: industry relevance × role relevance × goal alignment.

For each signal, generate ALL of the following fields (this is required JSON):

{
  "number": 1,
  "title": "Precise, newsworthy title under 15 words",
  "classification": "Strategic Signal | Emerging Trend | Tactical Update | Governance Alert | Hype/Noise",
  "whatHappened": "2-3 sentences. Facts only. No editorializing.",
  "whyItMatters": "1-2 sentences. The implication, not the event.",
  "industryImpact": "1-2 sentences. What changes in ${industryLabel}.",
  "roleImpact": "1-2 sentences. What changes for a ${roleLabel}.",
  "myTake": "1-2 sentences. The non-obvious read. What most people are missing.",
  "hook": "Single sentence ready to paste as a LinkedIn post opener. No 'I'. No 'excited to share'.",
  "contentAngle": "Post format, angle, and what makes it differentiated. (For create-content goal)",
  "salesIntel": "Buyer trigger, target title, conversation opener, pain point surfaced. (For sell-better goal)",
  "explainer": "Plain-English breakdown with analogy and key terms. (For learn-faster goal)",
  "executiveBrief": "Strategic risk or opportunity with 90-day action. (For lead-decide goal)"
}

Also generate these top-level briefing sections:

{
  "summary": ["bullet 1", "bullet 2", "bullet 3"],  // 3-5 one-sentence executive bullets
  "quickHits": "3-5 one-line signals with bold lead. **Actor action** — implication.",
  "contentIdeas": "2-3 developed post angles with hook + angle + format.",
  "driveTime": "5-minute radio-style briefing script. Conversational. No bullets. Use **bold** for segment headers.",
  "salesIntel": "Buyer intelligence: 1 trigger, 2 openers, 1 discovery question, 1 objection handle.",
  "explainers": "1-2 concept explainers each with plain-English definition + analogy + why it matters.",
  "strategyBrief": "Strategic risk, opportunity, 90-day action, and decision framework for executives."
}

## Rules

- Only include signals that directly affect ${industryLabel} professionals in a ${roleLabel} role
- Use specific numbers when available (percentages, dollar amounts, timelines, seat counts)
- Call out what's hype vs. what's real — don't treat press releases as news
- Every signal must end with something actionable
- Do NOT include: press releases, pure fundraising announcements, conference announcements

## Output format

Return ONLY valid JSON with this structure:
{
  "signals": [/* array of 3 SignalRecord objects */],
  "sections": {/* BriefingSections object */}
}

## Articles to analyze

${articleList}`;
}

// ── Generator ───────────────────────────────────────────────────────────────

export interface GenerateOptions {
  industry: string;
  role: string;
  contentGoals: string[];
  articles: RssArticle[];
  date: string;
}

export async function generateBriefing(opts: GenerateOptions): Promise<BriefingRecord> {
  const prompt = buildPrompt(opts);

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  // Extract JSON from the response (Claude sometimes wraps in markdown)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Claude returned no JSON. Response: ${text.slice(0, 200)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    signals: SignalRecord[];
    sections: BriefingSections;
  };

  const personaKey = buildPersonaKey(opts.industry, opts.role, opts.contentGoals);

  return {
    id: `${opts.date}-${personaKey}`,
    date: opts.date,
    personaKey,
    signals: parsed.signals,
    sections: parsed.sections,
    articlesFetched: opts.articles.length,
    generatedAt: new Date().toISOString(),
  };
}
