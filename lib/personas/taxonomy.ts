// Level 1 — 10 Industries
export const INDUSTRIES = [
  { id: "healthcare",         label: "Healthcare",                      emoji: "🏥" },
  { id: "banking-finance",    label: "Banking & Financial Services",    emoji: "🏦" },
  { id: "insurance",          label: "Insurance",                       emoji: "🛡️" },
  { id: "technology-saas",    label: "Technology / SaaS",               emoji: "💻" },
  { id: "education",          label: "Education",                       emoji: "🎓" },
  { id: "real-estate",        label: "Real Estate & Property",          emoji: "🏢" },
  { id: "retail-ecommerce",   label: "Retail & E-commerce",             emoji: "🛒" },
  { id: "manufacturing",      label: "Manufacturing & Supply Chain",    emoji: "🏭" },
  { id: "legal-compliance",   label: "Legal, Compliance & Risk",        emoji: "⚖️" },
  { id: "government",         label: "Government & Public Sector",      emoji: "🏛️" },
] as const;

// Level 2 — 10 Roles
export const ROLES = [
  { id: "sales",           label: "Sales Professional",          emoji: "🤝", description: "Quotas, pipeline, outreach, buyer signals" },
  { id: "marketing",       label: "Marketing Professional",      emoji: "📣", description: "Campaigns, content, brand, demand gen" },
  { id: "executive",       label: "Executive / Leader",          emoji: "🎯", description: "Strategy, decisions, org, competitive intel" },
  { id: "product",         label: "Product Manager",             emoji: "🗺️", description: "Roadmap, features, user research, GTM" },
  { id: "technology",      label: "Technology / IT Professional",emoji: "⚙️", description: "Architecture, systems, tools, security" },
  { id: "finance-ops",     label: "Finance / Operations",        emoji: "📊", description: "P&L, cost, efficiency, process, analytics" },
  { id: "hr-talent",       label: "HR / Talent Professional",    emoji: "👥", description: "Hiring, culture, L&D, workforce AI" },
  { id: "consultant",      label: "Consultant / Advisor",        emoji: "💡", description: "Client insights, frameworks, thought leadership" },
  { id: "content-creator", label: "Content Creator",             emoji: "✍️", description: "Writing, social, newsletters, audience growth" },
  { id: "student-learner", label: "Student / Learner",           emoji: "📚", description: "Concepts, skills, career, tools to learn" },
] as const;

// Level 3 — 5 Content Goals
export interface ContentGoal {
  id: string;
  label: string;
  emoji: string;
  tagline: string;
  delivers: string;
}

export const CONTENT_GOALS: ContentGoal[] = [
  {
    id: "stay-updated",
    label: "Stay Updated",
    emoji: "📡",
    tagline: "Know what's happening before everyone else",
    delivers: "Daily news, trends, and market signals curated for your industry and role",
  },
  {
    id: "create-content",
    label: "Create Content",
    emoji: "✍️",
    tagline: "Turn today's news into posts, scripts, and ideas",
    delivers: "LinkedIn posts, newsletter angles, hooks, Drive Time scripts — ready to publish",
  },
  {
    id: "sell-better",
    label: "Sell Better",
    emoji: "🤝",
    tagline: "Walk into every call knowing what your buyer is thinking",
    delivers: "Buyer insights, industry pain points, conversation starters, outreach angles",
  },
  {
    id: "learn-faster",
    label: "Learn Faster",
    emoji: "🧠",
    tagline: "Go from confused to confident on any topic",
    delivers: "Plain-English explainers, frameworks, tool comparisons, concept breakdowns",
  },
  {
    id: "lead-decide",
    label: "Lead & Decide Better",
    emoji: "🎯",
    tagline: "Signals that inform strategy, not just awareness",
    delivers: "Executive briefs, strategic risks, opportunities, decision frameworks",
  },
];

export type IndustryId = typeof INDUSTRIES[number]["id"];
export type RoleId = typeof ROLES[number]["id"];
export type ContentGoalId = "stay-updated" | "create-content" | "sell-better" | "learn-faster" | "lead-decide";

export function getIndustryLabel(id: string): string {
  return INDUSTRIES.find((i) => i.id === id)?.label ?? id;
}

export function getRoleLabel(id: string): string {
  return ROLES.find((r) => r.id === id)?.label ?? id;
}

export function getContentGoalLabel(id: string): string {
  return CONTENT_GOALS.find((g) => g.id === id)?.label ?? id;
}
