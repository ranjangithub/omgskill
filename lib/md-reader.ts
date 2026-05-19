import fs from "fs";
import path from "path";

// ── Generic markdown file reader ─────────────────────────────────────────────

export function readMarkdownFile(relativePath: string): string | null {
  const fp = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fp)) return null;
  try {
    return fs.readFileSync(fp, "utf-8");
  } catch {
    return null;
  }
}

// Strip YAML frontmatter and return { meta, body }
export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const meta: Record<string, string> = {};
  if (!raw.startsWith("---")) return { meta, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta, body: raw };
  const block = raw.slice(3, end).trim();
  for (const line of block.split("\n")) {
    const colon = line.indexOf(":");
    if (colon > 0) {
      meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim().replace(/^"|"$/g, "");
    }
  }
  return { meta, body: raw.slice(end + 4).trim() };
}

// Extract a named section (## Header) from markdown body, returns content until next ##
export function extractSection(body: string, header: string): string {
  const marker = `## ${header}`;
  const start = body.indexOf(marker);
  if (start === -1) return "";
  const rest = body.slice(start + marker.length);
  const next = rest.search(/\n## /);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

// Extract all ## sections as a map
export function extractAllSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = body.split(/\n(?=## )/);
  for (const part of parts) {
    const firstLine = part.split("\n")[0];
    if (firstLine.startsWith("## ")) {
      const header = firstLine.slice(3).trim();
      sections[header] = part.slice(firstLine.length).trim();
    }
  }
  return sections;
}

// ── Domain-specific readers ───────────────────────────────────────────────────

export function readResourcesFile(industryId: string): string | null {
  return readMarkdownFile(`data/resources/${industryId}.md`);
}

export function readOpportunitiesFixed(): string | null {
  return readMarkdownFile("data/opportunities/fixed.md");
}

export function readOpportunitiesDaily(date: string, industryId: string): string | null {
  return readMarkdownFile(`data/opportunities/${date}-${industryId}.md`);
}

export function readSocialPosts(date: string, personaKey: string): string | null {
  // personaKey uses | as separator — sanitize to filename
  const safe = personaKey.replace(/\|/g, "_").replace(/,/g, ",");
  return readMarkdownFile(`data/social/${date}-${safe}.md`);
}

export function readResumeAnalysis(userId: string): string | null {
  return readMarkdownFile(`data/resume/${userId}-analysis.md`) ??
         readMarkdownFile("data/resume/default-analysis.md");
}
