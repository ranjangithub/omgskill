import fs from "fs";
import path from "path";

export { INDUSTRIES, ROLES, CONTENT_GOALS } from "./taxonomy";
export type { ContentGoal, IndustryId, RoleId, ContentGoalId } from "./taxonomy";
export { getIndustryLabel, getRoleLabel, getContentGoalLabel } from "./taxonomy";

const PROMPTS_DIR = path.join(process.cwd(), "lib/personas/prompts");

const GOAL_TO_FILE: Record<string, string> = {
  "stay-updated":   "stay-updated.md",
  "create-content": "create-content.md",
  "sell-better":    "sell-better.md",
  "learn-faster":   "learn-faster.md",
  "lead-decide":    "lead-decide.md",
};

// Returns the combined prompt text for a given persona
export function buildPersonaPrompt(opts: {
  industry: string;
  role: string;
  contentGoals: string[];  // ordered by priority
}): string {
  const { industry, role, contentGoals } = opts;
  const sections: string[] = [];

  sections.push(
    `## Reader context\n- Industry: ${industry}\n- Role: ${role}\n- Content goals (in priority order): ${contentGoals.join(", ")}`
  );

  for (const goal of contentGoals) {
    const file = GOAL_TO_FILE[goal];
    if (!file) continue;
    try {
      const filePath = path.join(PROMPTS_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");
      sections.push(content);
    } catch {
      // prompt file missing — skip silently in prod
    }
  }

  return sections.join("\n\n---\n\n");
}
