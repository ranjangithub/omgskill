/**
 * File-based briefing store.
 * Reads/writes to data/briefings/{date}/{personaKey}.md
 *
 * Format:
 *   - YAML frontmatter: date, personaKey, articlesFetched, generatedAt, signals[]
 *   - Markdown body: named sections (## Summary, ## Quick Hits, etc.)
 *
 * This makes briefings human-readable, editable, and git-diffable.
 */
import fs from "fs";
import path from "path";
import type { BriefingRecord, BriefingSections, SignalRecord } from "./db/schema";

const STORE_DIR = path.join(process.cwd(), "data", "briefings");

// ── Path helpers ─────────────────────────────────────────────────────────────

function safeKey(personaKey: string): string {
  return personaKey.replace(/[|/\\:*?"<>]/g, "_");
}

function filePath(date: string, personaKey: string): string {
  return path.join(STORE_DIR, date, `${safeKey(personaKey)}.md`);
}

// ── Serialise → markdown ──────────────────────────────────────────────────────

export function writeBriefing(briefing: BriefingRecord): void {
  const dir = path.join(STORE_DIR, briefing.date);
  fs.mkdirSync(dir, { recursive: true });

  const lines: string[] = [];

  // ── Frontmatter (YAML) ──
  lines.push("---");
  lines.push(`date: ${briefing.date}`);
  lines.push(`personaKey: "${briefing.personaKey}"`);
  lines.push(`articlesFetched: ${briefing.articlesFetched}`);
  lines.push(`generatedAt: "${briefing.generatedAt}"`);
  lines.push(`id: "${briefing.id}"`);
  lines.push("");
  lines.push("signals:");
  for (const s of briefing.signals) {
    lines.push(`  - number: ${s.number}`);
    lines.push(`    classification: "${s.classification}"`);
    lines.push(`    title: ${yamlStr(s.title)}`);
    lines.push(`    whatHappened: ${yamlStr(s.whatHappened)}`);
    lines.push(`    whyItMatters: ${yamlStr(s.whyItMatters)}`);
    lines.push(`    industryImpact: ${yamlStr(s.industryImpact)}`);
    lines.push(`    roleImpact: ${yamlStr(s.roleImpact)}`);
    lines.push(`    myTake: ${yamlStr(s.myTake)}`);
    lines.push(`    hook: ${yamlStr(s.hook)}`);
    if (s.contentAngle)   lines.push(`    contentAngle: ${yamlStr(s.contentAngle)}`);
    if (s.salesIntel)     lines.push(`    salesIntel: ${yamlStr(s.salesIntel)}`);
    if (s.explainer)      lines.push(`    explainer: ${yamlStr(s.explainer)}`);
    if (s.executiveBrief) lines.push(`    executiveBrief: ${yamlStr(s.executiveBrief)}`);
    if (s.driveTimeScript)lines.push(`    driveTimeScript: ${yamlStr(s.driveTimeScript)}`);
  }
  lines.push("---");
  lines.push("");

  // ── Markdown body (human-readable) ──
  lines.push(`# ${briefing.date} — ${briefing.personaKey}`);
  lines.push("");

  lines.push("## Summary");
  for (const b of briefing.sections.summary) {
    lines.push(`- ${b}`);
  }
  lines.push("");

  lines.push("## Quick Hits");
  lines.push(briefing.sections.quickHits);
  lines.push("");

  lines.push("## Content Ideas");
  lines.push(briefing.sections.contentIdeas);
  lines.push("");

  lines.push("## Drive Time");
  lines.push(briefing.sections.driveTime);
  lines.push("");

  lines.push("## Sales Intel");
  lines.push(briefing.sections.salesIntel);
  lines.push("");

  lines.push("## Explainers");
  lines.push(briefing.sections.explainers);
  lines.push("");

  lines.push("## Strategy Brief");
  lines.push(briefing.sections.strategyBrief);
  lines.push("");

  // ── Full signal text (readable, for browsing in your editor) ──
  lines.push("---");
  lines.push("");
  lines.push("## Signals");
  lines.push("");
  for (const s of briefing.signals) {
    lines.push(`### Signal ${s.number}: ${s.title}`);
    lines.push(`**${s.classification}**`);
    lines.push("");
    lines.push(`**What happened:** ${s.whatHappened}`);
    lines.push("");
    lines.push(`**Why it matters:** ${s.whyItMatters}`);
    lines.push("");
    lines.push(`**Industry impact:** ${s.industryImpact}`);
    lines.push("");
    lines.push(`**Role impact:** ${s.roleImpact}`);
    lines.push("");
    lines.push(`**Expert take:** ${s.myTake}`);
    lines.push("");
    lines.push(`**Hook:** ${s.hook}`);
    if (s.contentAngle)   { lines.push(""); lines.push(`**Content angle:** ${s.contentAngle}`); }
    if (s.salesIntel)     { lines.push(""); lines.push(`**Sales intel:** ${s.salesIntel}`); }
    if (s.explainer)      { lines.push(""); lines.push(`**Explainer:** ${s.explainer}`); }
    if (s.executiveBrief) { lines.push(""); lines.push(`**Executive brief:** ${s.executiveBrief}`); }
    lines.push("");
  }

  fs.writeFileSync(filePath(briefing.date, briefing.personaKey), lines.join("\n"), "utf-8");
}

// ── Deserialise ← markdown ────────────────────────────────────────────────────

export function readBriefing(date: string, personaKey: string): BriefingRecord | null {
  try {
    const file = filePath(date, personaKey);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, "utf-8");
    return parseBriefingMd(raw);
  } catch {
    return null;
  }
}

function parseBriefingMd(raw: string): BriefingRecord {
  // Split on the closing --- of the frontmatter
  const fmEnd = raw.indexOf("\n---\n", 4);
  const frontmatter = raw.slice(4, fmEnd); // skip opening ---\n
  const body = raw.slice(fmEnd + 5);

  // Parse frontmatter with a minimal YAML reader (no external dep needed)
  const fm = parseMinimalYaml(frontmatter);

  // Parse markdown body sections
  const sections = parseBodySections(body);

  return {
    id: fm.id as string,
    date: fm.date as string,
    personaKey: fm.personaKey as string,
    articlesFetched: Number(fm.articlesFetched),
    generatedAt: fm.generatedAt as string,
    signals: (fm.signals as SignalRecord[]) ?? [],
    sections,
  };
}

// ── Minimal YAML parser ───────────────────────────────────────────────────────
// Handles scalar fields and the signals[] array we write above.
// Not a general YAML parser — only covers what writeBriefing produces.

function parseMinimalYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Top-level scalar: key: value
    const scalarMatch = line.match(/^(\w+):\s*(.+)$/);
    if (scalarMatch && scalarMatch[1] !== "signals") {
      result[scalarMatch[1]] = scalarMatch[2].replace(/^"|"$/g, "");
      i++;
      continue;
    }

    // signals: array
    if (line.trim() === "signals:") {
      const signals: SignalRecord[] = [];
      i++;
      let current: Partial<SignalRecord> | null = null;

      while (i < lines.length) {
        const sl = lines[i];
        const itemStart = sl.match(/^  - (\w+):\s*(.+)$/);
        const itemCont  = sl.match(/^    (\w+):\s*(.+)$/);

        if (itemStart) {
          if (itemStart[1] === "number") {
            if (current) signals.push(current as SignalRecord);
            current = {};
          }
          if (current) {
            (current as Record<string, unknown>)[itemStart[1]] =
              itemStart[2].replace(/^"|"$/g, "");
          }
          i++;
        } else if (itemCont && current) {
          (current as Record<string, unknown>)[itemCont[1]] =
            itemCont[2].replace(/^"|"$/g, "");
          i++;
        } else {
          break;
        }
      }
      if (current) signals.push(current as SignalRecord);
      // Fix number field to be numeric
      for (const s of signals) (s as unknown as Record<string,unknown>).number = Number(s.number);
      result.signals = signals;
      continue;
    }

    i++;
  }

  return result;
}

function parseBodySections(body: string): BriefingSections {
  const sectionMap: Record<string, string> = {};
  const parts = body.split(/^## /m);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    if (nl === -1) continue;
    const heading = part.slice(0, nl).trim();
    const content = part.slice(nl + 1).trim();
    sectionMap[heading] = content;
  }

  return {
    summary: (sectionMap["Summary"] ?? "")
      .split("\n")
      .filter((l) => l.startsWith("- "))
      .map((l) => l.slice(2).trim()),
    quickHits:     sectionMap["Quick Hits"]    ?? "",
    contentIdeas:  sectionMap["Content Ideas"] ?? "",
    driveTime:     sectionMap["Drive Time"]    ?? "",
    salesIntel:    sectionMap["Sales Intel"]   ?? "",
    explainers:    sectionMap["Explainers"]    ?? "",
    strategyBrief: sectionMap["Strategy Brief"]?? "",
  };
}

// ── Directory helpers ─────────────────────────────────────────────────────────

export function listBriefingDatesForPersona(personaKey: string): string[] {
  try {
    if (!fs.existsSync(STORE_DIR)) return [];
    const key = safeKey(personaKey);
    return fs.readdirSync(STORE_DIR)
      .filter((date) => fs.existsSync(path.join(STORE_DIR, date, `${key}.md`)))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export function listPersonaKeysForDate(date: string): string[] {
  try {
    const dir = path.join(STORE_DIR, date);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(".md", "").replace(/_/g, "|"));
  } catch {
    return [];
  }
}

// ── YAML string escaper ───────────────────────────────────────────────────────

function yamlStr(s: string): string {
  // Wrap in double quotes, escape any internal quotes and newlines
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  return `"${escaped}"`;
}
